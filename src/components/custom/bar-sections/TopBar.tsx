"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Grid3X3,
  List,
  MoreVertical,
  Search,
  Settings,
  User,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { SidebarTrigger } from "@/components/custom/bar-sections/SideBar";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface TopBarProps {
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  currentFolder: string;
  onSidebarToggle?: () => void;
  needsToToggle: boolean;
  navigationStack: { id: string; name: string }[];
  onFolderChange: (id: string | null) => void;
}

export function TopBar({
  viewMode,
  onViewModeChange,
  currentFolder,
  onSidebarToggle,
  needsToToggle,
  navigationStack,
  onFolderChange,
}: TopBarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <div className="border-b bg-background p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          {onSidebarToggle && <SidebarTrigger onClick={onSidebarToggle} />}
          <div className="flex items-center gap-1 min-w-0 overflow-x-auto no-scrollbar">
            <h1 
                className={`text-xl font-semibold hidden sm:block cursor-pointer hover:text-blue-600 transition-colors ${navigationStack.length === 0 ? "text-foreground" : "text-muted-foreground"}`}
                onClick={() => onFolderChange(null)}
            >
                {currentFolder}
            </h1>
            
            {navigationStack.map((folder, index) => (
                <div key={folder.id} className="flex items-center gap-1 shrink-0">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    <span 
                        className={`text-xl font-semibold cursor-pointer hover:text-blue-600 transition-colors truncate max-w-[150px] sm:max-w-[200px] ${index === navigationStack.length - 1 ? "text-foreground" : "text-muted-foreground"}`}
                        onClick={() => onFolderChange(folder.id)}
                        title={folder.name}
                    >
                        {folder.name}
                    </span>
                </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {needsToToggle && (
            <>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search in Drive"
                  className="pl-10 w-60 lg:w-80"
                />
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => onViewModeChange && onViewModeChange("grid")}
                  className="hidden sm:flex"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => onViewModeChange && onViewModeChange("list")}
                  className="hidden sm:flex"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="sm:hidden">
                <Search className="w-4 h-4 mr-2" />
                Search
              </DropdownMenuItem>
              {needsToToggle && (
                <DropdownMenuItem
                  className="sm:hidden"
                  onClick={() =>
                    onViewModeChange &&
                    onViewModeChange(viewMode === "grid" ? "list" : "grid")
                  }
                >
                  {viewMode === "grid" ? (
                    <List className="w-4 h-4 mr-2" />
                  ) : (
                    <Grid3X3 className="w-4 h-4 mr-2" />
                  )}
                  {viewMode === "grid" ? "List view" : "Grid view"}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account" className="flex items-center w-full">
                  <User className="w-4 h-4 mr-2" />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
