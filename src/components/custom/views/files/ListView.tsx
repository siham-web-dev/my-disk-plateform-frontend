"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  ArrowUpDown,
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
  owner?: string;
  hasPassword?: boolean;
  userId: string;
}

interface FileListProps {
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

export function FileList({ files, onStar, onTrash, onDelete, onOpenFolder, onShare, onDownload }: FileListProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const toggleAllFiles = () => {
    setSelectedFiles((prev) =>
      prev.length === files.length ? [] : files.map((f) => f.id)
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
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border rounded-md">
        <FolderOpen className="w-12 h-12 mb-4 opacity-20" />
        <p>No files found in this category</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedFiles.length === files.length && files.length > 0}
                  onCheckedChange={toggleAllFiles}
                />
              </TableHead>
              <TableHead className="w-8"></TableHead>
              <TableHead className="min-w-[200px]">
                <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent">
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">Owner</TableHead>
              <TableHead className="hidden lg:table-cell">
                <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent">
                  Last modified
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent">
                  File size
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => {
              const Icon = getFileIcon(file.type, file.isFolder);
              const isSelected = selectedFiles.includes(file.id);

              return (
                <TableRow
                  key={file.id}
                  className={`cursor-pointer ${isSelected ? "bg-blue-50/50" : ""}`}
                  onClick={() => toggleFileSelection(file.id)}
                  onDoubleClick={() => handleDoubleClick(file)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleFileSelection(file.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="relative">
                      <Icon className={`w-5 h-5 ${file.isFolder ? "text-amber-500" : "text-blue-500"}`} />
                      {file.isStarred && (
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 absolute -top-1 -right-1" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div
                      className="truncate max-w-[150px] sm:max-w-[200px] lg:max-w-none"
                      title={file.name}
                    >
                      {file.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">
                    {file.owner || "You"}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden lg:table-cell">
                    {formatDistanceToNow(new Date(file.updatedAt))} ago
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden sm:table-cell">
                    {file.isFolder ? "-" : formatSize(file.size)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreVertical className="w-4 h-4" />
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
