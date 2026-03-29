import { TopBar } from "../bar-sections/TopBar";

interface MainViewProps {
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  currentFolder: string;
  onSidebarToggle?: () => void;
  needsToToggle: boolean;
  children?: React.ReactNode;
  navigationStack: { id: string; name: string }[];
  onFolderChange: (id: string | null) => void;
}

const MainView: React.FC<MainViewProps> = ({
  viewMode,
  onViewModeChange,
  currentFolder,
  onSidebarToggle,
  needsToToggle,
  children,
  navigationStack,
  onFolderChange,
}) => {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <TopBar
        needsToToggle={needsToToggle}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        currentFolder={currentFolder}
        onSidebarToggle={onSidebarToggle}
        navigationStack={navigationStack}
        onFolderChange={onFolderChange}
      />
      {children}
    </div>
  );
};

export default MainView;
