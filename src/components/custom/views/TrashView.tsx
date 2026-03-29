"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  MoreVertical,
  RotateCcw,
  Trash2,
  FolderOpen,
  ArrowUpDown,
  AlertTriangle,
  Calendar,
  Loader2,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getFilesByCategory, toggleFileTrash, deleteFilePermanently } from "@/actions/files";
import toast from "react-hot-toast";
import { formatDistanceToNow, addDays, differenceInDays } from "date-fns";

function getFileIcon(type: string, isFolder: boolean) {
  if (isFolder) return FolderOpen;
  const lowerType = type.toLowerCase();
  if (lowerType.includes("image")) return ImageIcon;
  if (lowerType.includes("video")) return Video;
  if (lowerType.includes("audio")) return Music;
  if (lowerType.includes("zip") || lowerType.includes("rar")) return Archive;
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

export function TrashView() {
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const data = await getFilesByCategory(user.id, "Trash");
      setFiles(data);
    } catch (error) {
      toast.error("Failed to load trash");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

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

  const handleRestore = async (id: string, isFolder: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const result = await toggleFileTrash(user.id, id, false, isFolder);
      if (result.success) {
        toast.success("Item restored");
        fetchFiles();
        setSelectedFiles(prev => prev.filter(p => p !== id));
      } else {
        toast.error(result.error || "Failed to restore item");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string, isFolder: boolean) => {
    const confirm = window.confirm("Permanently delete this item? This cannot be undone.");
    if (!confirm) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const result = await deleteFilePermanently(user.id, id, isFolder);
      if (result.success) {
        toast.success("Deleted permanently");
        fetchFiles();
        setSelectedFiles(prev => prev.filter(p => p !== id));
      } else {
        toast.error(result.error || "Failed to delete item");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleBulkRestore = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      for(const id of selectedFiles) {
          const item = files.find(f => f.id === id);
          await toggleFileTrash(user.id, id, false, item.isFolder);
      }
      toast.success("Selected items restored");
      fetchFiles();
      setSelectedFiles([]);
    } catch (error) {
      toast.error("An error occurred during bulk restore");
    }
  };

  const handleBulkDelete = async () => {
    const confirm = window.confirm(`Permanently delete ${selectedFiles.length} items?`);
    if (!confirm) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      for(const id of selectedFiles) {
           const item = files.find(f => f.id === id);
           await deleteFilePermanently(user.id, id, item.isFolder);
      }
      toast.success("Selected items deleted");
      fetchFiles();
      setSelectedFiles([]);
    } catch (error) {
      toast.error("An error occurred during bulk delete");
    }
  }

  const totalSizeBytes = files.reduce((acc, f) => acc + parseInt(f.size || "0"), 0);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Trash</h2>
          <p className="text-sm text-muted-foreground">
            Items in trash are deleted forever after 30 days •{" "}
            {files.length} items • {formatSize(totalSizeBytes.toString())}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {selectedFiles.length > 0 && (
            <>
              <Button variant="outline" onClick={handleBulkRestore} size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Restore ({selectedFiles.length})
              </Button>
              <Button variant="destructive" onClick={handleBulkDelete} size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Forever
              </Button>
            </>
          )}
        </div>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Items in trash are automatically deleted after 30 days. You can
          restore them before then or delete them permanently.
        </AlertDescription>
      </Alert>

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
                <TableHead className="min-w-[150px]">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium text-xs sm:text-sm"
                  >
                    Name
                    <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Original Location
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium text-xs sm:text-sm"
                  >
                    Deleted Date
                    <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </TableHead>
                <TableHead className="hidden sm:table-cell">Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => {
                const Icon = getFileIcon(file.type, file.isFolder);
                const isSelected = selectedFiles.includes(file.id);
                const deletedDate = new Date(file.updatedAt);
                const expiryDate = addDays(deletedDate, 30);
                const daysLeft = differenceInDays(expiryDate, new Date());

                return (
                  <TableRow
                    key={file.id}
                    className={`cursor-pointer ${
                      isSelected ? "bg-blue-50/50" : ""
                    } ${daysLeft <= 1 ? "bg-red-50/50" : ""}`}
                    onClick={() => toggleFileSelection(file.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleFileSelection(file.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${file.isFolder ? "text-amber-500" : "text-blue-500"}`} />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div
                        className="truncate max-w-[120px] sm:max-w-[200px] lg:max-w-none text-xs sm:text-sm"
                        title={file.name}
                      >
                        {file.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm hidden lg:table-cell">
                      {file.isFolder ? "Folder" : "File"} in Trash
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(deletedDate)} ago
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm hidden sm:table-cell">
                      {file.isFolder ? "-" : formatSize(file.size)}
                    </TableCell>
                    <TableCell>
                        <Badge variant={daysLeft <= 1 ? "destructive" : "secondary"} className="text-[10px]">
                            {daysLeft <= 0 ? "Expired" : `${daysLeft} days left`}
                        </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6 sm:w-8 sm:h-8"
                          >
                            <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRestore(file.id, file.isFolder)}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(file.id, file.isFolder)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Forever
                          </DropdownMenuItem>
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

      {files.length === 0 && (
        <div className="text-center py-8 sm:py-12 border rounded-md">
          <Trash2 className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-base sm:text-lg font-medium mb-2">
            Trash is empty
          </h3>
          <p className="text-sm text-muted-foreground px-4">
            Items you delete will appear here before being permanently removed
            after 30 days.
          </p>
        </div>
      )}
    </div>
  );
}
