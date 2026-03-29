"use client";

import { useEffect, useState, useCallback } from "react";
import { FileGrid } from "./files/GridView";
import { FileList } from "./files/ListView";
import { getFilesByCategory, toggleFileStar, toggleFileTrash, deleteFilePermanently } from "@/actions/files";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { PasswordPromptModal } from "@/components/custom/modals/PasswordPromptModal";

import { ChevronRight, Folder } from "lucide-react";
import { FileItem } from "@/types/files";

interface ToggleFileViewProps {
  viewMode: "grid" | "list";
  currentFolder: string;
  currentFolderId: string | null;
  onFolderChange: (id: string | null) => void;
  refreshKey?: number;
  navigationStack: { id: string; name: string }[];
  onShare: (id: string, type: "file" | "folder", name: string) => void;
}

const ToggleFileView = ({
  viewMode,
  currentFolder,
  currentFolderId,
  onFolderChange,
  refreshKey,
  navigationStack,
  onShare
}: ToggleFileViewProps) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Password Gate State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordTarget, setPasswordTarget] = useState<{ id: string, type: "file" | "folder", name: string, action: () => void } | null>(null);

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      if (!user) return;

      const data = await getFilesByCategory(user.id, currentFolder, currentFolderId);
      setFiles(data as FileItem[]);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to load files");
    } finally {
      setIsLoading(false);
    }
  }, [currentFolder, currentFolderId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles, refreshKey]);

  const handleStar = async (id: string, isStarred: boolean, isFolder: boolean) => {
    const result = await toggleFileStar(id, isStarred, isFolder);
    if (result.success) {
      toast.success(isStarred ? "Added to starred" : "Removed from starred");
      fetchFiles();
    } else {
      toast.error("Failed to update star");
    }
  };

  const checkPasswordGate = (item: FileItem, action: () => void) => {
    // If user is owner, skip gate
    if (item.userId === currentUserId) {
      action();
      return;
    }

    // If item has password, prompt for it
    if (item.hasPassword) {
      setPasswordTarget({
        id: item.id,
        name: item.name,
        type: item.isFolder ? "folder" : "file",
        action
      });
      setIsPasswordModalOpen(true);
    } else {
      action();
    }
  };

  const handleTrash = async (id: string, isTrashed: boolean, isFolder: boolean) => {
    const item = files.find(f => f.id === id);
    if (!item) return;

    checkPasswordGate(item, async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const result = await toggleFileTrash(user.id, id, isTrashed, isFolder);
        if (result.success) {
          toast.success(isTrashed ? "Moved to trash" : "Restored from trash");
          fetchFiles();
        } else {
          toast.error(result.error || "Failed to move to trash");
        }
      } catch {
        toast.error("An error occurred");
      }
    });
  };

  const handleDelete = async (id: string, isFolder: boolean) => {
    const item = files.find(f => f.id === id);
    if (!item) return;

    const performDelete = async () => {
      const confirm = window.confirm("Are you sure you want to permanently delete this item? This action cannot be undone.");
      if (!confirm) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const result = await deleteFilePermanently(user.id, id, isFolder);
        if (result.success) {
          toast.success("Deleted permanently");
          fetchFiles();
        } else {
          toast.error(result.error || "Failed to delete item");
        }
      } catch {
        toast.error("An error occurred");
      }
    };

    checkPasswordGate(item, performDelete);
  };

  const handleDownload = (file: FileItem) => {
    checkPasswordGate(file, () => {
      if (file.url) {
        window.open(file.url, "_blank");
      }
    });
  };

  const handleOpenFolder = (id: string) => {
    onFolderChange(id);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-auto p-3 sm:p-4">
      {/* Search and Navigation Bar - Added breadcrumbs back here as requested */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1 text-sm font-medium">
          <Button
            variant="ghost"
            size="sm"
            className={`px-2 py-1 h-auto rounded flex items-center gap-1.5 transition-colors ${navigationStack.length === 0 ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
            onClick={() => onFolderChange(null)}
          >
            <Folder className="w-4 h-4 text-blue-500" />
            {currentFolder}
          </Button>

          {navigationStack.map((folder, index) => (
            <div key={folder.id} className="flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
              <Button
                variant="ghost"
                size="sm"
                className={`px-2 py-1 h-auto rounded transition-colors ${index === navigationStack.length - 1 ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50"}`}
                onClick={() => onFolderChange(folder.id)}
              >
                {folder.name}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {viewMode === "grid" ? (
        <FileGrid
          files={files}
          onStar={handleStar}
          onTrash={handleTrash}
          onDelete={handleDelete}
          onOpenFolder={handleOpenFolder}
          onShare={onShare}
          onDownload={handleDownload}
        />
      ) : (
        <FileList
          files={files}
          onStar={handleStar}
          onTrash={handleTrash}
          onDelete={handleDelete}
          onOpenFolder={handleOpenFolder}
          onShare={onShare}
          onDownload={handleDownload}
        />
      )}

      {passwordTarget && (
        <PasswordPromptModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSuccess={passwordTarget.action}
          itemName={passwordTarget.name}
          itemId={passwordTarget.id}
          itemType={passwordTarget.type}
        />
      )}
    </main>
  );
};

export default ToggleFileView;
