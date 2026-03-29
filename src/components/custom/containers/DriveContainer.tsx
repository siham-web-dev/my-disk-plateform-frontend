"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/custom/bar-sections/SideBar";
import { UploadModal } from "@/components/custom/modals/UploadModal";
import MainView from "../views/MainView";
import ToggleFileView from "../views/ToggleFileView";
import { getFolderPath } from "@/actions/files";
import { ShareModal } from "@/components/custom/modals/ShareModal";

export default function DriveContainer({
  children,
  currentFolder,
  needsToToggle,
  folderId,
}: {
  currentFolder: string;
  children?: React.ReactNode;
  needsToToggle: boolean;
  folderId?: string;
}) {
  const router = useRouter();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState<{id: string, type: "file" | "folder", name: string} | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(folderId || null);
  const [navigationStack, setNavigationStack] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    setCurrentFolderId(folderId || null);
  }, [folderId, currentFolder]);

  useEffect(() => {
    const fetchPath = async () => {
      if (currentFolderId) {
        const path = await getFolderPath(currentFolderId);
        setNavigationStack(path);
      } else {
        setNavigationStack([]);
      }
    };
    fetchPath();
  }, [currentFolderId, refreshKey]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleFolderChange = (id: string | null) => {
    if (id) {
      router.push(`/my-drive?folderId=${id}`);
    } else {
      router.push("/my-drive");
    }
  };

  const handleShareOpen = (id: string, type: "file" | "folder", name: string) => {
    setShareData({ id, type, name });
    setIsShareModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {!isMobile && <Sidebar onNewFile={() => setIsUploadModalOpen(true)} refreshKey={refreshKey} />}

      {isMobile && (
        <Sidebar
          onNewFile={() => setIsUploadModalOpen(true)}
          isMobile={true}
          isOpen={sidebarOpen}
          onOpenChange={setSidebarOpen}
          refreshKey={refreshKey}
        />
      )}
      <MainView
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentFolder={currentFolder}
        onSidebarToggle={isMobile ? () => setSidebarOpen(true) : undefined}
        needsToToggle={needsToToggle}
        navigationStack={navigationStack}
        onFolderChange={handleFolderChange}
      >
        {needsToToggle ? (
            <ToggleFileView 
                viewMode={viewMode} 
                currentFolder={currentFolder} 
                currentFolderId={currentFolderId}
                onFolderChange={handleFolderChange}
                refreshKey={refreshKey}
                navigationStack={navigationStack}
                onShare={handleShareOpen}
            />
        ) : children}
      </MainView>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
        folderId={currentFolderId || undefined}
      />
      {shareData && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          itemId={shareData.id}
          itemType={shareData.type}
          itemName={shareData.name}
        />
      )}
    </div>
  );
}
