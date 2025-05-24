import { TopBar } from "../bar-sections/TopBar";

interface MainViewProps {
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  currentFolder: string;
  onSidebarToggle?: () => void;
  needsToToggle: boolean;
  children?: React.ReactNode;
}

const MainView: React.FC<MainViewProps> = ({
  viewMode,
  onViewModeChange,
  currentFolder,
  onSidebarToggle,
  needsToToggle,
  children,
}) => {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <TopBar
        needsToToggle={needsToToggle}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        currentFolder={currentFolder}
        onSidebarToggle={onSidebarToggle}
      />
      {children}
    </div>
  );
};

export default MainView;
