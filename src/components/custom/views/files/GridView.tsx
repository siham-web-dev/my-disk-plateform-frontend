"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  MoreVertical,
  Download,
  Share,
  Trash2,
  Star,
  FolderOpen,
  RefreshCw,
  X,
  ExternalLink,
  Lock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  isStarred: boolean;
  isTrashed: boolean;
  updatedAt: Date;
  isFolder: boolean;
  url?: string;
  hasPassword?: boolean;
  userId: string;
}

interface FileGridProps {
  files: FileItem[];
  onStar: (id: string, isStarred: boolean, isFolder: boolean) => Promise<void>;
  onTrash: (id: string, isTrashed: boolean, isFolder: boolean) => Promise<void>;
  onDelete: (id: string, isFolder: boolean) => Promise<void>;
  onOpenFolder?: (id: string, name: string) => void;
  onShare: (id: string, type: "file" | "folder", name: string) => void;
  onDownload: (file: FileItem) => void;
}

function getFileIcon(type: string, isFolder: boolean) {
  if (isFolder) return FolderOpen;
  
  const lowerType = type.toLowerCase();
  if (lowerType.includes("image")) return ImageIcon;
  if (lowerType.includes("video")) return Video;
  if (lowerType.includes("audio")) return Music;
  if (lowerType.includes("zip") || lowerType.includes("rar") || lowerType.includes("7z")) return Archive;
  
  return FileText;
}

const formatSize = (sizeStr: string) => {
  const bytes = parseInt(sizeStr);
  if (isNaN(bytes) || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function FileGrid({ files, onStar, onTrash, onDelete, onOpenFolder, onShare, onDownload }: FileGridProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleDoubleClick = (file: FileItem) => {
    if (file.isFolder && onOpenFolder) {
      onOpenFolder(file.id, file.name);
    } else if (!file.isFolder) {
      onDownload(file);
    }
  };

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <FolderOpen className="w-12 h-12 mb-4 opacity-20" />
        <p>No files found in this category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4">
      {files.map((file) => {
        const Icon = getFileIcon(file.type, file.isFolder);
        const isSelected = selectedFiles.includes(file.id);

        return (
          <Card
            key={file.id}
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${
              isSelected ? "ring-2 ring-blue-500 bg-blue-50/50" : ""
            }`}
            onClick={() => toggleFileSelection(file.id)}
            onDoubleClick={() => handleDoubleClick(file)}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative">
                  <Icon className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${file.isFolder ? "text-amber-500" : "text-blue-500"}`} />
                  {file.isStarred && (
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500 absolute -top-1 -right-1" />
                  )}
                </div>
                <div className="w-full min-w-0">
                  <p
                    className="text-xs sm:text-sm font-medium truncate"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  {!file.isFolder && (
                    <p className="text-[10px] text-muted-foreground">{formatSize(file.size)}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground hidden sm:block">
                    {formatDistanceToNow(new Date(file.updatedAt))} ago
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-5 h-5 sm:w-6 sm:h-6"
                    >
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {file.isFolder && onOpenFolder && (
                      <DropdownMenuItem onClick={() => onOpenFolder(file.id, file.name)}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open
                      </DropdownMenuItem>
                    )}
                    {!file.isFolder && file.url && (
                      <DropdownMenuItem onClick={() => onDownload(file)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                        {file.hasPassword && <Lock className="w-3 h-3 ml-auto text-amber-500" />}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onShare(file.id, file.isFolder ? "folder" : "file", file.name)}>
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStar(file.id, !file.isStarred, file.isFolder)}>
                      <Star className={`w-4 h-4 mr-2 ${file.isStarred ? "fill-yellow-500 text-yellow-500" : ""}`} />
                      {file.isStarred ? "Remove from starred" : "Add to starred"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onTrash(file.id, !file.isTrashed, file.isFolder)} className={file.isTrashed ? "" : "text-red-600"}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      {file.isTrashed ? "Restore" : "Move to trash"}
                    </DropdownMenuItem>
                    {file.isTrashed && (
                         <DropdownMenuItem onClick={() => onDelete(file.id, file.isFolder)} className="text-red-600 font-bold">
                            <X className="w-4 h-4 mr-2" />
                            Delete Permanently
                         </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
