"use server";

import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserSettings(userId: string) {
  try {
    let settings = await prisma.settings.findUnique({
      where: { userId },
    });

    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          userId,
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        storageUsed: true,
        storageLimit: true,
      },
    });

    return { settings, storage: user };
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }
}

export async function updateUserSettings(userId: string, data: Prisma.SettingsUpdateInput) {
  try {
    const settings = await prisma.settings.update({
      where: { userId },
      data,
    });
    revalidatePath("/settings");
    return { success: true, settings };
  } catch (error) {
    console.error("Error updating user settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}

export async function emptyTrash(userId: string) {
  try {
    // 1. Find all trashed files
    const trashedFiles = await prisma.file.findMany({
      where: { userId, isTrashed: true },
      select: { size: true, id: true },
    });

    if (trashedFiles.length === 0) return { success: true, count: 0 };

    const totalSizeReleased = trashedFiles.reduce((sum, file) => sum + Number(file.size), 0);

    // 2. Delete the files from DB
    await prisma.file.deleteMany({
      where: { userId, isTrashed: true },
    });

    // 3. Update user storageUsed
    await prisma.user.update({
      where: { id: userId },
      data: {
        storageUsed: {
          decrement: totalSizeReleased,
        },
      },
    });

    revalidatePath("/settings");
    return { success: true, count: trashedFiles.length, sizeReleased: totalSizeReleased };
  } catch (error) {
    console.error("Error emptying trash:", error);
    return { success: false, error: "Failed to empty trash" };
  }
}

export async function deleteUserAccount(userId: string) {
  try {
    // Cascade delete is handled by Prisma (onDelete: Cascade)
    await prisma.user.delete({
      where: { id: userId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting user account:", error);
    return { success: false, error: "Failed to delete account" };
  }
}
