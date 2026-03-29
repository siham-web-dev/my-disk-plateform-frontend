"use server";

import prisma from "@/lib/prisma";
import { logActivity } from "./user";
import { Permission } from "@prisma/client";

export async function shareItem(data: {
  senderId: string;
  itemId: string;
  itemType: "file" | "folder";
  recipientEmail: string;
  permission: Permission;
  password?: string;
}) {
  try {
    // 1. Fetch Sender and their Plan
    const sender = await prisma.user.findUnique({
      where: { id: data.senderId },
      include: { plan: true },
    });

    if (!sender || !sender.plan) {
      return { success: false, error: "Sender profile or plan not found" };
    }

    // 2. Enforce Plan: Basic Sharing Check
    if (!sender.plan.canShare) {
      return { success: false, error: "Your current plan does not allow sharing. Please upgrade." };
    }

    // 3. Enforce Plan: Sharing Limits (Pro has max 10)
    if (sender.plan.numPeopleToShare > 0) {
      const existingSharesCount = await prisma.sharedItem.count({
        where: {
          OR: [
            { fileId: data.itemType === "file" ? data.itemId : undefined },
            { folderId: data.itemType === "folder" ? data.itemId : undefined },
          ],
        },
      });

      if (existingSharesCount >= sender.plan.numPeopleToShare) {
        return { success: false, error: `You have reached the sharing limit for this item (${sender.plan.numPeopleToShare} people). Upgrade to Enterprise for unlimited sharing.` };
      }
    }

    // 4. Enforce Plan: Password Security Check
    if (data.password && !sender.plan.hasSecurity) {
      return { success: false, error: "Password protection is an Enterprise feature. Please upgrade your plan." };
    }

    // 5. Find Recipient or Create Shadow Account
    let recipient = await prisma.user.findUnique({
      where: { email: data.recipientEmail },
    });

    if (!recipient) {
      // Create a "shadow" user or handle invited users
      // For now, we'll just return an error or handle it as "Share with non-existing user"
      return { success: false, error: "Recipient user must have an account first." };
    }
    
    // 6. Prevent self-sharing
    if (recipient.id === data.senderId) {
        return { success: false, error: "You cannot share an item with yourself." };
    }

    // 7. Update Password if set (and permitted)
    if (data.password && sender.plan.hasSecurity) {
        // In a real app, hash this!
        if (data.itemType === "file") {
            await prisma.file.update({
                where: { id: data.itemId },
                data: { password: data.password }
            });
        } else {
            await prisma.folder.update({
                where: { id: data.itemId },
                data: { password: data.password }
            });
        }
    }

    // 8. Create Share Record
    const sharedItem = await prisma.sharedItem.create({
      data: {
        fileId: data.itemType === "file" ? data.itemId : undefined,
        folderId: data.itemType === "folder" ? data.itemId : undefined,
        sharedWithId: recipient.id,
        permission: data.permission,
      },
    });

    // 9. Log Activity
    await logActivity(data.senderId, {
      type: "SHARE",
      description: `Shared ${data.itemType} with ${data.recipientEmail}`,
      metadata: { 
          itemId: data.itemId, 
          recipientId: recipient.id,
          permission: data.permission,
          hasPassword: !!data.password 
      },
    });

    // 10. Trigger Notification logic
    await sendShareNotification(recipient.id, sender.name || sender.email, data.itemId, data.itemType);

    return { success: true, sharedItem };
  } catch (error) {
    console.error("Error sharing item:", error);
    return { success: false, error: "An unexpected error occurred during sharing." };
  }
}

// Internal notification trigger
async function sendShareNotification(recipientId: string, senderName: string, itemId: string, itemType: string) {
    try {
        const recipientSettings = await prisma.settings.findUnique({
            where: { userId: recipientId }
        });

        if (!recipientSettings) return;

        if (recipientSettings.sharingNotifications) {
            if (recipientSettings.emailNotifications) {
                console.log(`[Notification] Sending Email to user ${recipientId}: ${senderName} shared a ${itemType} with you.`);
            }
            if (recipientSettings.desktopNotifications) {
                console.log(`[Notification] Sending Desktop Alert to user ${recipientId}: New ${itemType} share from ${senderName}.`);
            }
        }
    } catch (error) {
        console.error("Failed to trigger share notification:", error);
    }
}
export async function verifyItemPassword(itemId: string, itemType: "file" | "folder", password: string) {
    try {
        const item = itemType === "file" 
            ? await prisma.file.findUnique({ where: { id: itemId } })
            : await prisma.folder.findUnique({ where: { id: itemId } });
            
        if (!item) return { success: false, error: "Item not found" };
        if (!item.password) return { success: true };
        
        const isValid = item.password === password;
        return { success: isValid, error: isValid ? undefined : "Incorrect password" };
    } catch (error) {
        console.error("Error verifying password:", error);
        return { success: false, error: "Database error" };
    }
}
