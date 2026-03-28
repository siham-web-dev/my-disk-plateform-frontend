"use server";

import prisma from "@/lib/prisma";

export async function getSidebarCounts(userId: string) {
  try {
    const [myDriveFiles, myDriveFolders, sharedWithMe, starred, trash, user] =
      await Promise.all([
        // My Drive: non-trashed files
        prisma.file.count({
          where: { userId, isTrashed: false },
        }),
        // My Drive: non-trashed folders
        prisma.folder.count({
          where: { userId, isTrashed: false },
        }),
        // Shared with me
        prisma.sharedItem.count({
          where: { sharedWithId: userId },
        }),
        // Starred files + folders
        Promise.all([
          prisma.file.count({ where: { userId, isStarred: true, isTrashed: false } }),
          prisma.folder.count({ where: { userId, isStarred: true, isTrashed: false } }),
        ]).then(([f, fo]) => f + fo),
        // Trash: trashed files + folders
        Promise.all([
          prisma.file.count({ where: { userId, isTrashed: true } }),
          prisma.folder.count({ where: { userId, isTrashed: true } }),
        ]).then(([f, fo]) => f + fo),
        // User with current plan
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            storageUsed: true,
            storageLimit: true,
            plan: { select: { storageLimit: true } },
          },
        }),
      ]);

    return {
      myDrive: myDriveFiles + myDriveFolders,
      sharedWithMe,
      starred,
      trash,
      storageUsed: Number(user?.storageUsed ?? 0),
      // Prefer plan's storageLimit → fall back to user's own storageLimit column (schema default: 5GB)
      storageLimit: Number(user?.plan?.storageLimit ?? user?.storageLimit ?? 41943040),
    };
  } catch (error) {
    console.error("Error fetching sidebar counts:", error);
    return { myDrive: 0, sharedWithMe: 0, starred: 0, trash: 0, storageUsed: 0, storageLimit: 41943040 };
  }
}
