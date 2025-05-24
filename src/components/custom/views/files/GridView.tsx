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
} from "lucide-react";

const files = [
  {
    id: 1,
    name: "Project Proposal.docx",
    type: "document",
    size: "2.4 MB",
    modified: "2 hours ago",
    starred: false,
  },
  {
    id: 2,
    name: "Vacation Photos",
    type: "folder",
    size: "24 items",
    modified: "1 day ago",
    starred: true,
  },
  {
    id: 3,
    name: "presentation.pptx",
    type: "document",
    size: "5.1 MB",
    modified: "3 days ago",
    starred: false,
  },
  {
    id: 4,
    name: "IMG_2024.jpg",
    type: "image",
    size: "3.2 MB",
    modified: "1 week ago",
    starred: false,
  },
  {
    id: 5,
    name: "video-call.mp4",
    type: "video",
    size: "45.6 MB",
    modified: "2 weeks ago",
    starred: true,
  },
  {
    id: 6,
    name: "music-playlist.mp3",
    type: "audio",
    size: "4.8 MB",
    modified: "1 month ago",
    starred: false,
  },
  {
    id: 7,
    name: "backup.zip",
    type: "archive",
    size: "128 MB",
    modified: "2 months ago",
    starred: false,
  },
  {
    id: 8,
    name: "Budget 2024.xlsx",
    type: "document",
    size: "1.2 MB",
    modified: "3 months ago",
    starred: false,
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

export function FileGrid() {
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);

  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4">
      {files.map((file) => {
        const Icon = getFileIcon(file.type);
        const isSelected = selectedFiles.includes(file.id);

        return (
          <Card
            key={file.id}
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${
              isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => toggleFileSelection(file.id)}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative">
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-500" />
                  {file.starred && (
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
                  <p className="text-xs text-muted-foreground">{file.size}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {file.modified}
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
                      {file.starred ? "Remove from starred" : "Add to starred"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Move to trash
                    </DropdownMenuItem>
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
