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
} from "lucide-react";

const files = [
  {
    id: 1,
    name: "Project Proposal.docx",
    type: "document",
    size: "2.4 MB",
    modified: "2 hours ago",
    starred: false,
    owner: "You",
  },
  {
    id: 2,
    name: "Vacation Photos",
    type: "folder",
    size: "24 items",
    modified: "1 day ago",
    starred: true,
    owner: "You",
  },
  {
    id: 3,
    name: "presentation.pptx",
    type: "document",
    size: "5.1 MB",
    modified: "3 days ago",
    starred: false,
    owner: "John Doe",
  },
  {
    id: 4,
    name: "IMG_2024.jpg",
    type: "image",
    size: "3.2 MB",
    modified: "1 week ago",
    starred: false,
    owner: "You",
  },
  {
    id: 5,
    name: "video-call.mp4",
    type: "video",
    size: "45.6 MB",
    modified: "2 weeks ago",
    starred: true,
    owner: "Jane Smith",
  },
  {
    id: 6,
    name: "music-playlist.mp3",
    type: "audio",
    size: "4.8 MB",
    modified: "1 month ago",
    starred: false,
    owner: "You",
  },
  {
    id: 7,
    name: "backup.zip",
    type: "archive",
    size: "128 MB",
    modified: "2 months ago",
    starred: false,
    owner: "You",
  },
  {
    id: 8,
    name: "Budget 2024.xlsx",
    type: "document",
    size: "1.2 MB",
    modified: "3 months ago",
    starred: false,
    owner: "Team",
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

export function FileList() {
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
      prev.length === files.length ? [] : files.map((f) => f.id)
    );
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedFiles.length === files.length}
                  onCheckedChange={toggleAllFiles}
                />
              </TableHead>
              <TableHead className="w-8"></TableHead>
              <TableHead className="min-w-[200px]">
                <Button variant="ghost" className="h-auto p-0 font-medium">
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">Owner</TableHead>
              <TableHead className="hidden lg:table-cell">
                <Button variant="ghost" className="h-auto p-0 font-medium">
                  Last modified
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <Button variant="ghost" className="h-auto p-0 font-medium">
                  File size
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => {
              const Icon = getFileIcon(file.type);
              const isSelected = selectedFiles.includes(file.id);

              return (
                <TableRow
                  key={file.id}
                  className={`cursor-pointer ${isSelected ? "bg-blue-50" : ""}`}
                  onClick={() => toggleFileSelection(file.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleFileSelection(file.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="relative">
                      <Icon className="w-5 h-5 text-blue-500" />
                      {file.starred && (
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
                    {file.owner}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden lg:table-cell">
                    {file.modified}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden sm:table-cell">
                    {file.size}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star className="w-4 h-4 mr-2" />
                          {file.starred
                            ? "Remove from starred"
                            : "Add to starred"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Move to trash
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
  );
}
