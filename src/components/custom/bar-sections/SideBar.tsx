"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Cloud,
  FolderOpen,
  Plus,
  Star,
  Trash2,
  Users,
  Menu,
} from "lucide-react";
import Logo from "../logo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getSidebarCounts } from "@/actions/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarProps {
  onNewFile: () => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Sidebar({
  onNewFile,
  isMobile = false,
  isOpen = false,
  onOpenChange,
}: SidebarProps) {
  const pathname = usePathname();
  const [counts, setCounts] = useState({
    myDrive: 0,
    sharedWithMe: 0,
    starred: 0,
    trash: 0,
  });
  const [storage, setStorage] = useState({ used: 0, limit: 1 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsLoading(false); return; }

      const sidebarCounts = await getSidebarCounts(user.id);

      setCounts(sidebarCounts);
      setStorage({ used: sidebarCounts.storageUsed, limit: sidebarCounts.storageLimit });
      setIsLoading(false);
    };

    fetchCounts();
  }, [pathname]); // refetch whenever user navigates

  const folders = [
    { name: "My Drive", icon: FolderOpen, count: counts.myDrive, link: "/my-drive" },
    { name: "Shared with me", icon: Users, count: counts.sharedWithMe, link: "/shared" },
    { name: "Starred", icon: Star, count: counts.starred, link: "/stared" },
    { name: "Trash", icon: Trash2, count: counts.trash, link: "/trash" },
  ];

  const storagePercent = storage.limit > 0
    ? Math.min(100, Math.round((storage.used / storage.limit) * 100))
    : 0;

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  };

  const SidebarContent = () => (
    <div className="w-64 border-r bg-background flex flex-col h-full">
      <div className="p-4 border-b flex flex-col gap-3">
        <Logo />
        <Button onClick={onNewFile} className="w-full justify-start gap-2">
          <Plus className="w-4 h-4" />
          New
        </Button>
      </div>

      <nav className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {folders.map((folder) => (
            <Button
              key={folder.name}
              variant={pathname === folder.link ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              asChild
            >
              <Link href={folder.link}>
                <folder.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{folder.name}</span>
                {isLoading ? (
                  <Skeleton className="h-3 w-5 rounded" />
                ) : folder.count > 0 ? (
                  <span className="text-xs text-muted-foreground">{folder.count}</span>
                ) : null}
              </Link>
            </Button>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
            Storage
          </div>
          <div className="px-3 py-2">
            {isLoading ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-3 w-36 rounded" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Cloud className="w-4 h-4" />
                  <span>{formatSize(storage.used)} used of {formatSize(storage.limit)}</span>
                </div>
                <div className="mt-2 w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${storagePercent}%` }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return <SidebarContent />;
}

export function SidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} className="md:hidden">
      <Menu className="w-5 h-5" />
    </Button>
  );
}
