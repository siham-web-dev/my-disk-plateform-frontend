export interface FileItem {
  id: string;
  name: string;
  type?: string;
  size?: string;
  isStarred: boolean;
  isTrashed: boolean;
  updatedAt: Date;
  isFolder: boolean;
  url?: string;
  owner?: string;
  hasPassword?: boolean;
  userId: string;
}
