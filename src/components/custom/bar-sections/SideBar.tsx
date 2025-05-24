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
  const folders = [
    { name: "My Drive", icon: FolderOpen, count: 24, link: "/my-drive" },
    { name: "Shared with me", icon: Users, count: 8, link: "/shared" },
    { name: "Starred", icon: Star, count: 5, link: "/stared" },
    { name: "Trash", icon: Trash2, count: 3, link: "/trash" },
  ];
  const pathname = usePathname();

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
                <span className="text-xs text-muted-foreground">
                  {folder.count}
                </span>
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
            <div className="flex items-center gap-2 text-sm">
              <Cloud className="w-4 h-4" />
              <span>15 GB used of 100 GB</span>
            </div>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "15%" }}
              />
            </div>
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
