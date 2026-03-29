"use server";

import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        plan: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function getUserActivities(userId: string) {
  try {
    const activities = await prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return activities;
  } catch (error) {
    console.error("Error fetching user activities:", error);
    return [];
  }
}

export async function logActivity(userId: string, data: { type: string; description: string; metadata?: Prisma.InputJsonValue }) {
  try {
    const activity = await prisma.activity.create({
      data: {
        userId,
        type: data.type,
        description: data.description,
        metadata: data.metadata,
      },
    });
    return { success: true, activity };
  } catch (error) {
    console.error("Error logging activity:", error);
    return { success: false };
  }
}

export async function updateUserProfile(userId: string, data: { name?: string; image?: string }) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    await logActivity(userId, {
      type: "PROFILE_UPDATE",
      description: `Updated profile details: ${Object.keys(data).join(", ")}`,
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function syncUser(authData: { id: string; email: string; name?: string }) {
  try {
    const user = await prisma.user.upsert({
      where: { id: authData.id },
      update: {
        email: authData.email,
        name: authData.name,
      },
      create: {
        id: authData.id,
        email: authData.email,
        name: authData.name,
      },
    });

    await logActivity(authData.id, {
      type: "LOGIN",
      description: "User session synchronized",
    });

    return user;
  } catch (error) {
    console.error("Error syncing user:", error);
    return null;
  }
}
