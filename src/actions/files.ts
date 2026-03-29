"use server";

import prisma from "@/lib/prisma";
import { logActivity } from "./user";

export async function getFilesByCategory(userId: string, category: string, folderId: string | null = null) {
  try {
    let whereClauseFile: any = { userId, isTrashed: false };
    let whereClauseFolder: any = { userId, isTrashed: false };

    // Handle Folder Hierarchy
    if (folderId) {
        whereClauseFile.folderId = folderId;
        whereClauseFolder.parentId = folderId;
        
        // If we are looking at Trash category but inside a folder (rare, but possible if navigating trash hierarchy)
        if (category.toLowerCase() === "trash") {
            whereClauseFile.isTrashed = true;
            whereClauseFolder.isTrashed = true;
        }
    } else {
        switch (category) {
          case "Starred":
          case "stared":
          case "starred":
            whereClauseFile.isStarred = true;
            whereClauseFile.isTrashed = false;
            whereClauseFolder.isStarred = true;
            whereClauseFolder.isTrashed = false;
            break;
          case "Trash":
          case "trash":
            whereClauseFile.isTrashed = true;
            whereClauseFolder.isTrashed = true;
            break;
          case "Shared":
          case "shared":
          case "Shared with me":
            // ... (keep shared logic as is, it's already complex)
            const sharedItems = await prisma.sharedItem.findMany({
              where: { sharedWithId: userId },
              include: { file: true, folder: true },
            });
            const sharedFiles = sharedItems
              .filter(item => item.file && !item.file.isTrashed)
              .map(item => ({...item.file, id: item.file?.id, permission: item.permission, isShared: true, hasPassword: !!item.file?.password}));
            const sharedFolders = sharedItems
              .filter(item => item.folder && !item.folder.isTrashed)
              .map(item => ({...item.folder, id: item.folder?.id, permission: item.permission, isShared: true, hasPassword: !!item.folder?.password}));
            return [...sharedFolders, ...sharedFiles].map(item => ({
                ...item,
                size: ("size" in item && item.size) ? item.size.toString() : "0",
                isFolder: !("size" in item),
                hasPassword: item.hasPassword,
            }));
          case "My Drive":
          default:
            whereClauseFile.isTrashed = false;
            whereClauseFolder.isTrashed = false;
            // Only show root level items in My Drive if no folderId is provided
            whereClauseFile.folderId = null;
            whereClauseFolder.parentId = null;
            break;
        }
    }

    const [files, folders] = await Promise.all([
      prisma.file.findMany({ where: whereClauseFile, orderBy: { updatedAt: "desc" } }),
      prisma.folder.findMany({ where: whereClauseFolder, orderBy: { updatedAt: "desc" } }),
    ]);

    const serializedFiles = files.map((file) => ({
      ...file,
      size: file.size.toString(),
      isFolder: false,
      hasPassword: !!file.password,
    }));

    const serializedFolders = folders.map((folder) => ({
      ...folder,
      size: "0",
      isFolder: true,
      type: "folder",
      hasPassword: !!folder.password,
    }));

    return [...serializedFolders, ...serializedFiles];
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
}

export async function createFileMetadata(data: {
  userId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  folderId?: string;
}) {
  try {
    const file = await prisma.file.create({
      data: {
        userId: data.userId,
        name: data.name,
        type: data.type,
        size: BigInt(data.size),
        url: data.url,
        folderId: data.folderId,
      },
    });

    // Update user storage used
    await prisma.user.update({
      where: { id: data.userId },
      data: { storageUsed: { increment: BigInt(data.size) } },
    });

    await logActivity(data.userId, {
      type: "UPLOAD",
      description: `Uploaded file: ${data.name}`,
      metadata: { fileId: file.id, size: data.size },
    });

    return { success: true, file: { ...file, size: file.size.toString() } };
  } catch (error) {
    console.error("Error creating file metadata:", error);
    return { success: false, error: "Failed to save file metadata" };
  }
}

export async function createFolder(userId: string, name: string, parentId?: string) {
  try {
    const folder = await prisma.folder.create({
      data: {
        userId,
        name,
        parentId,
      },
    });

    await logActivity(userId, {
      type: "FOLDER_CREATE",
      description: `Created folder: ${name}`,
      metadata: { folderId: folder.id },
    });

    return { success: true, folder };
  } catch (error) {
    console.error("Error creating folder:", error);
    return { success: false, error: "Failed to create folder" };
  }
}

export async function toggleFileStar(fileId: string, isStarred: boolean, isFolder: boolean = false) {
  try {
    if (isFolder) {
      await prisma.folder.update({
        where: { id: fileId },
        data: { isStarred },
      });
    } else {
      await prisma.file.update({
        where: { id: fileId },
        data: { isStarred },
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error toggling star:", error);
    return { success: false };
  }
}

export async function toggleFileTrash(userId: string, fileId: string, isTrashed: boolean, isFolder: boolean = false) {
  try {
    // 1. Fetch Item and its Owner
    const item = isFolder 
      ? await prisma.folder.findUnique({ where: { id: fileId } })
      : await prisma.file.findUnique({ where: { id: fileId } });

    if (!item) return { success: false, error: "Item not found" };

    // 2. Check Permissions
    if (item.userId !== userId) {
      // Not the owner, check for shared permission
      const share = await prisma.sharedItem.findFirst({
        where: {
          sharedWithId: userId,
          [isFolder ? "folderId" : "fileId"]: fileId,
          permission: { in: ["DELETE", "EDIT"] } // Allow EDIT to trash
        }
      });

      if (!share) {
        return { success: false, error: "You do not have permission to trash this item." };
      }
    }

    if (isFolder) {
      await prisma.folder.update({
        where: { id: fileId },
        data: { isTrashed },
      });
    } else {
      await prisma.file.update({
        where: { id: fileId },
        data: { isTrashed },
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error toggling trash:", error);
    return { success: false, error: "Database error" };
  }
}

export async function deleteFilePermanently(userId: string, fileId: string, isFolder: boolean = false) {
  try {
    // 1. Fetch Item and its Owner
    const item = isFolder 
      ? await prisma.folder.findUnique({ where: { id: fileId } })
      : await prisma.file.findUnique({ where: { id: fileId } });

    if (!item) return { success: false, error: "Item not found" };

    // 2. Check Permissions (DELETE strictly required for permanent deletion)
    if (item.userId !== userId) {
      const share = await prisma.sharedItem.findFirst({
        where: {
          sharedWithId: userId,
          [isFolder ? "folderId" : "fileId"]: fileId,
          permission: "DELETE" 
        }
      });

      if (!share) {
        return { success: false, error: "You do not have permission to permanently delete this item." };
      }
    }

    if (isFolder) {
        await prisma.folder.delete({ where: { id: fileId } });
    } else {
        const file = item as any; // We already fetched it
        // Decrement storage used
        await prisma.user.update({
            where: { id: file.userId },
            data: { storageUsed: { decrement: file.size } }
        });
        await prisma.file.delete({ where: { id: fileId } });
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting permanently:", error);
    return { success: false, error: "Database error" };
  }
}

export async function getFolderPath(folderId: string) {
  try {
    const path: { id: string; name: string }[] = [];
    let currentId: string | null = folderId;

    while (currentId) {
      const folder: { id: string; name: string; parentId: string | null } | null = await prisma.folder.findUnique({
        where: { id: currentId },
        select: { id: true, name: true, parentId: true },
      });

      if (!folder) break;

      path.unshift({ id: folder.id, name: folder.name });
      currentId = folder.parentId;
    }

    return path;
  } catch (error) {
    console.error("Error fetching folder path:", error);
    return [];
  }
}
