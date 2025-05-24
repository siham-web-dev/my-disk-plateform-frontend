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
} from "lucide-react";

const trashedFiles = [
  {
    id: 1,
    name: "Old Project.docx",
    type: "document",
    size: "2.4 MB",
    deletedDate: "2023-12-10",
    deletedBy: "You",
    originalLocation: "My Drive/Projects",
    daysLeft: 25,
  },
  {
    id: 2,
    name: "Unused Images",
    type: "folder",
    size: "45.2 MB",
    deletedDate: "2023-12-08",
    deletedBy: "You",
    originalLocation: "My Drive/Media",
    daysLeft: 23,
  },
  {
    id: 3,
    name: "draft-presentation.pptx",
    type: "document",
    size: "8.1 MB",
    deletedDate: "2023-12-05",
    deletedBy: "John Doe",
    originalLocation: "Shared/Team Presentations",
    daysLeft: 20,
  },
  {
    id: 4,
    name: "vacation-2022.jpg",
    type: "image",
    size: "3.2 MB",
    deletedDate: "2023-11-28",
    deletedBy: "You",
    originalLocation: "My Drive/Photos/2022",
    daysLeft: 13,
  },
  {
    id: 5,
    name: "old-backup.zip",
    type: "archive",
    size: "128 MB",
    deletedDate: "2023-11-20",
    deletedBy: "You",
    originalLocation: "My Drive/Backups",
    daysLeft: 5,
  },
  {
    id: 6,
    name: "meeting-recording.mp4",
    type: "video",
    size: "245 MB",
    deletedDate: "2023-11-15",
    deletedBy: "Jane Smith",
    originalLocation: "Shared/Meetings",
    daysLeft: 1,
  },
];

function getFileIcon(type: string) {
  switch (type) {
    case "folder":
      return FolderOpen;
    case "image":
      return ImageIcon;
    case "video":
      return Video;
    case "audio":
      return Music;
    case "archive":
      return Archive;
    default:
      return FileText;
  }
}

function getDaysLeftBadge(daysLeft: number) {
  if (daysLeft <= 1) {
    return (
      <Badge variant="destructive" className="text-xs">
        Expires today
      </Badge>
    );
  } else if (daysLeft <= 7) {
    return (
      <Badge
        variant="secondary"
        className="text-xs bg-orange-100 text-orange-800"
      >
        {daysLeft} days left
      </Badge>
    );
  } else {
    return (
      <Badge variant="secondary" className="text-xs">
        {daysLeft} days left
      </Badge>
    );
  }
}

export function TrashView() {
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);

  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const toggleAllFiles = () => {
    setSelectedFiles((prev) =>
      prev.length === trashedFiles.length ? [] : trashedFiles.map((f) => f.id)
    );
  };

  const restoreSelected = () => {
    console.log("Restoring files:", selectedFiles);
    setSelectedFiles([]);
  };

  const deleteSelected = () => {
    console.log("Permanently deleting files:", selectedFiles);
    setSelectedFiles([]);
  };

  const emptyTrash = () => {
    console.log("Emptying entire trash");
    setSelectedFiles([]);
  };

  const totalSize = trashedFiles.reduce((acc, file) => {
    const sizeValue = Number.parseFloat(file.size.split(" ")[0]);
    const unit = file.size.split(" ")[1];
    const sizeInMB = unit === "GB" ? sizeValue * 1024 : sizeValue;
    return acc + sizeInMB;
  }, 0);

  return (
    <div className="space-y-4 sm:space-y-6 p-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Trash</h2>
          <p className="text-sm text-muted-foreground">
            Items in trash are deleted forever after 30 days •{" "}
            {trashedFiles.length} items • {(totalSize / 1024).toFixed(1)} GB
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {selectedFiles.length > 0 && (
            <>
              <Button variant="outline" onClick={restoreSelected} size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Restore ({selectedFiles.length})
              </Button>
              <Button variant="destructive" onClick={deleteSelected} size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Forever
              </Button>
            </>
          )}
          <Button variant="destructive" onClick={emptyTrash} size="sm">
            Empty Trash
          </Button>
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
                    checked={selectedFiles.length === trashedFiles.length}
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
                <TableHead className="hidden md:table-cell">
                  Deleted By
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
              {trashedFiles.map((file) => {
                const Icon = getFileIcon(file.type);
                const isSelected = selectedFiles.includes(file.id);

                return (
                  <TableRow
                    key={file.id}
                    className={`cursor-pointer ${
                      isSelected ? "bg-blue-50" : ""
                    } ${file.daysLeft <= 1 ? "bg-red-50" : ""}`}
                    onClick={() => toggleFileSelection(file.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleFileSelection(file.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="font-medium text-muted-foreground">
                      <div
                        className="truncate max-w-[120px] sm:max-w-[200px] lg:max-w-none text-xs sm:text-sm"
                        title={file.name}
                      >
                        {file.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm hidden lg:table-cell">
                      <div
                        className="truncate max-w-[150px]"
                        title={file.originalLocation}
                      >
                        {file.originalLocation}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm hidden md:table-cell">
                      {file.deletedBy}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(file.deletedDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm hidden sm:table-cell">
                      {file.size}
                    </TableCell>
                    <TableCell>{getDaysLeftBadge(file.daysLeft)}</TableCell>
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
                          <DropdownMenuItem>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
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

      {trashedFiles.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <Trash2 className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-4" />
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
