"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, File, FolderPlus, X, CheckCircle } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          setTimeout(() => {
            setUploadComplete(false);
            setSelectedFiles([]);
            onClose();
          }, 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Choose files to upload to your Drive
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isUploading && !uploadComplete && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Upload className="w-6 h-6" />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    Upload Files
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </Button>

                <Button variant="outline" className="h-20 flex-col gap-2">
                  <FolderPlus className="w-6 h-6" />
                  <span>New Folder</span>
                </Button>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files:</Label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded"
                      >
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4" />
                          <span className="text-sm truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024 / 1024).toFixed(1)} MB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={simulateUpload} className="flex-1">
                      Upload {selectedFiles.length} file
                      {selectedFiles.length !== 1 ? "s" : ""}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedFiles([])}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {isUploading && (
            <div className="space-y-4">
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto text-blue-500 animate-pulse" />
                <p className="mt-2 text-sm">Uploading files...</p>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-center text-sm text-muted-foreground">
                {uploadProgress}% complete
              </p>
            </div>
          )}

          {uploadComplete && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
              <p className="text-sm">Upload complete!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
