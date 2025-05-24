"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/custom/bar-sections/SideBar";
import { UploadModal } from "@/components/custom/modals/UploadModal";
import MainView from "../views/MainView";
import ToggleFileView from "../views/ToggleFileView";

export default function DriveContainer({
  children,
  currentFolder,
  needsToToggle,
}: {
  currentFolder: string;
  children?: React.ReactNode;
  needsToToggle: boolean;
}) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {!isMobile && <Sidebar onNewFile={() => setIsUploadModalOpen(true)} />}

      {isMobile && (
        <Sidebar
          onNewFile={() => setIsUploadModalOpen(true)}
          isMobile={true}
          isOpen={sidebarOpen}
          onOpenChange={setSidebarOpen}
        />
      )}
      <MainView
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentFolder={currentFolder}
        onSidebarToggle={isMobile ? () => setSidebarOpen(true) : undefined}
        needsToToggle={needsToToggle}
      >
        {needsToToggle ? <ToggleFileView viewMode={viewMode} /> : children}
      </MainView>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
