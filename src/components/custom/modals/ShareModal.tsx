"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { shareItem } from "@/actions/share";
import { getUserProfile } from "@/actions/user";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Shield, Sparkles } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemType: "file" | "folder";
  itemName: string;
}

export function ShareModal({
  isOpen,
  onClose,
  itemId,
  itemType,
  itemName,
}: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("VIEW");
  const [password, setPassword] = useState("");
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userPlan, setUserPlan] = useState<any>(null);

  useEffect(() => {
    async function fetchUserPlan() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const profile = await getUserProfile(user.id);
        setUserPlan(profile?.plan);
      }
    }
    if (isOpen) {
      fetchUserPlan();
    }
  }, [isOpen]);

  const handleShare = async () => {
    if (!email) {
      toast.error("Please enter a recipient email");
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const result = await shareItem({
        senderId: user.id,
        itemId,
        itemType,
        recipientEmail: email,
        permission: permission as any,
        password: isPasswordProtected ? password : undefined,
      });

      if (result.success) {
        toast.success("Item shared successfully!");
        onClose();
        // Reset form
        setEmail("");
        setPermission("VIEW");
        setPassword("");
        setIsPasswordProtected(false);
      } else {
        toast.error(result.error || "Failed to share item");
      }
    } catch (error) {
      console.error("Share error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isPro = userPlan?.name?.toLowerCase().includes("pro");
  const isEnterprise = userPlan?.name?.toLowerCase().includes("entreprise");
  const canShare = userPlan?.canShare || false;
  const hasSecurity = userPlan?.hasSecurity || false;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Share "{itemName}"
            {!canShare && (
                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-normal">
                    Free Restricted
                </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!canShare && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-sm text-amber-800 flex items-start gap-2">
                 <Sparkles className="w-4 h-4 mt-0.5 text-amber-500" />
                 <div>
                    <p className="font-semibold text-xs">Upgrade Required</p>
                    <p className="text-xs opacity-80">Free plan does not support sharing. Upgrade to Pro to share with up to 10 people.</p>
                 </div>
              </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Recipient Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || !canShare}
            />
          </div>

          <div className="space-y-2">
            <Label>Permission</Label>
            <Select 
                value={permission} 
                onValueChange={setPermission}
                disabled={isLoading || !canShare}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select permission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIEW">Can View</SelectItem>
                <SelectItem value="EDIT">Can Edit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-1.5 cursor-pointer" onClick={() => hasSecurity && setIsPasswordProtected(!isPasswordProtected)}>
                  <Shield className={`w-3.5 h-3.5 ${hasSecurity ? "text-blue-500" : "text-muted-foreground"}`} />
                  Password Protection
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  {hasSecurity ? "Restrict access with a password." : "Enterprise plan feature."}
                </p>
              </div>
              <Switch 
                checked={isPasswordProtected}
                onCheckedChange={setIsPasswordProtected}
                disabled={isLoading || !hasSecurity || !canShare}
              />
            </div>
          </div>

          {isPasswordProtected && hasSecurity && (
            <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
              <Label htmlFor="password">Security Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter access password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleShare} 
            disabled={isLoading || !canShare}
            className="min-w-[80px]"
          >
            {isLoading ? "Sharing..." : "Share"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
