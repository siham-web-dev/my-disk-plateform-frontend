"use client";

import type React from "react";
import { useState, useRef } from "react";
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
import { Upload, File, FolderPlus, X, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { createFileMetadata, createFolder } from "@/actions/files";
import toast from "react-hot-toast";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  folderId?: string;
}

export function UploadModal({ isOpen, onClose, onSuccess, folderId }: UploadModalProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleUpload = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let completed = 0;
      for (const file of selectedFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${Math.random().toString(36).substring(7)}-${file.name}`;
        const filePath = `${fileName}`;

        // 1. Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("files")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from("files")
          .getPublicUrl(filePath);

        // 3. Save to Prisma DB
        const result = await createFileMetadata({
          userId: user.id,
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          url: publicUrl,
          folderId: folderId,
        });

        if (!result.success) throw new Error(result.error);

        completed++;
        setUploadProgress(Math.round((completed / selectedFiles.length) * 100));
      }

      setUploadComplete(true);
      toast.success("All files uploaded successfully!");
      if (onSuccess) onSuccess();

      setUploadComplete(false);
      setSelectedFiles([]);
      onClose();
      setUploadProgress(0);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const result = await createFolder(user.id, newFolderName, folderId);
      if (result.success) {
        toast.success(`Folder '${newFolderName}' created!`);
        setIsCreatingFolder(false);
        setNewFolderName("");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error("Failed to create folder");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full">
        <DialogHeader>
          <DialogTitle>{isCreatingFolder ? "New Folder" : "Upload Files"}</DialogTitle>
          <DialogDescription>
            {isCreatingFolder ? "Create a new directory in your Drive" : "Choose files to upload to your Drive"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-w-md">
          {!isUploading && !uploadComplete && !isCreatingFolder && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-6 h-6" />
                  <span className="cursor-pointer text-sm">Upload Files</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </Button>

                <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setIsCreatingFolder(true)}>
                  <FolderPlus className="w-6 h-6" />
                  <span className="text-sm">New Folder</span>
                </Button>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">Selected Files:</Label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <File className="w-4 h-4 shrink-0" />
                          <span className="text-xs truncate">{file.name}</span>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
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
                    <Button onClick={handleUpload} className="flex-1 text-sm h-9">
                      Upload {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedFiles([])}
                      className="text-sm h-9"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {isCreatingFolder && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="folderName">Folder Name</Label>
                <Input
                  id="folderName"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Untitled folder"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCreateFolder() }}
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateFolder} className="flex-1" disabled={!newFolderName.trim()}>
                  Create Folder
                </Button>
                <Button variant="outline" onClick={() => { setIsCreatingFolder(false); setNewFolderName("") }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="space-y-4 py-4">
              <div className="text-center">
                <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin" />
                <p className="mt-2 text-sm font-medium">Uploading your files...</p>
              </div>
              <Progress value={uploadProgress} className="w-full h-2" />
              <p className="text-center text-xs text-muted-foreground">
                {uploadProgress}% complete
              </p>
            </div>
          )}

          {uploadComplete && (
            <div className="text-center space-y-4 py-4">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
              <p className="text-sm font-medium">Upload complete!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
