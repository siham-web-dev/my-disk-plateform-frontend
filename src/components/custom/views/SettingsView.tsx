"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bell,
  HardDrive,
  Palette,
  Shield,
  Trash2,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getUserSettings, updateUserSettings, emptyTrash, deleteUserAccount } from "@/actions/settings";
import { getPricingPlans, getSubscriptionStatus } from "@/actions/plans";
import { UpgradePlansList, UpgradePlanProps } from "@/components/custom/containers/UpgradePlansList";
import { getUserProfile, syncUser } from "@/actions/user";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const SettingsView = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [storage, setStorage] = useState<any>({ storageUsed: 0, storageLimit: 5368709120 });
  const [user, setUser] = useState<any>(null);
  const [availablePlans, setAvailablePlans] = useState<UpgradePlanProps[]>([]);
  const [currentPlanName, setCurrentPlanName] = useState("Free");
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: Date | null;
  }>({ status: "none", cancelAtPeriodEnd: false, currentPeriodEnd: null });
  const router = useRouter();

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const data = await getUserSettings(user.id);
      if (data) {
        setSettings(data.settings);
        setStorage(data.storage);
      }

      const dbUser = await getUserProfile(user.id);
      setCurrentPlanName(dbUser?.plan?.name || "Free");

      const subStatus = await getSubscriptionStatus(user.id);
      setSubscriptionStatus(subStatus);

      const dataPlans = await getPricingPlans();
      setAvailablePlans(
        dataPlans.map((plan) => ({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          price: plan.price,
          canShare: plan.canShare,
          numPeopleToShare: plan.numPeopleToShare,
          hasSecurity: plan.hasSecurity,
          storageLimit: plan.storageLimit.toString(),
          stripeMonthlyPriceId: plan.stripeMonthlyPriceId,
          stripeYearlyPriceId: plan.stripeYearlyPriceId,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  const handleUpdate = async (key: string, value: any) => {
    if (!user) return;

    // Optimistic update
    const previousSettings = { ...settings };
    setSettings((prev: any) => ({ ...prev, [key]: value }));
    setSaving(key);

    const result = await updateUserSettings(user.id, { [key]: value });

    if (!result.success) {
      setSettings(previousSettings);
      toast.error(`Failed to update ${key}`);
    } else {
      toast.success("Settings updated");
    }
    setSaving(null);
  };

  const handleEmptyTrash = async () => {
    if (!user) return;
    const confirm = window.confirm("Are you sure you want to permanently delete all files in trash?");
    if (!confirm) return;

    const result = await emptyTrash(user.id);
    if (result.success) {
      toast.success(`Emptied trash: ${result.count} files deleted.`);
      // Update local storage stats
      setStorage((prev: any) => ({
        ...prev,
        storageUsed: prev.storageUsed - (result.sizeReleased || 0)
      }));
    } else {
      toast.error("Failed to empty trash");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirm = window.confirm("DANGER: This will permanently delete your account and all files. This action cannot be undone.");
    if (!confirm) return;

    const result = await deleteUserAccount(user.id);
    if (result.success) {
      await supabase.auth.signOut();
      router.push("/sign-in");
      toast.success("Account deleted successfully.");
    } else {
      toast.error("Failed to delete account");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const storagePercent = Math.min(100, Math.round((Number(storage.storageUsed) / Number(storage.storageLimit)) * 100));

  return (
    <main className="flex-1 overflow-auto p-3 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your MyDisk preferences and account settings
          </p>
        </div>
        <Tabs defaultValue="general" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto">
            <TabsTrigger value="general" className="text-xs sm:text-sm">
              General
            </TabsTrigger>
            <TabsTrigger value="storage" className="text-xs sm:text-sm">
              Storage
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="text-xs sm:text-sm hidden sm:block"
            >
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
                  Appearance
                </CardTitle>
                <CardDescription className="text-sm">
                  Customize how MyDisk looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-sm">
                    Theme
                  </Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(v) => handleUpdate("theme", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LIGHT">Light</SelectItem>
                      <SelectItem value="DARK">Dark</SelectItem>
                      <SelectItem value="SYSTEM">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-sm">
                    Language
                  </Label>
                  <Select
                    value={settings.language}
                    onValueChange={(v) => handleUpdate("language", v)}
                  >
                    <SelectTrigger className="w-full" >
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-sm">
                    Timezone
                  </Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(v) => handleUpdate("timezone", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="CET">Central European Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <HardDrive className="w-4 h-4 sm:w-5 sm:h-5" />
                  Storage Usage
                </CardTitle>
                <CardDescription className="text-sm">
                  Monitor and manage your storage space
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used storage</span>
                    <span>{formatSize(Number(storage.storageUsed))} of {formatSize(Number(storage.storageLimit))}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${storagePercent}%` }}
                    />
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-4">Upgrade Storage</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-6xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none">
                    <DialogHeader className="sr-only">
                      <DialogTitle>Choose Your Plan</DialogTitle>
                    </DialogHeader>
                    <div className="w-full max-h-[85vh] overflow-y-auto rounded-xl shadow-2xl bg-white">
                      <UpgradePlansList
                        plans={availablePlans}
                        currentPlanName={currentPlanName}
                        hasActiveSubscription={subscriptionStatus.status === "active" && !subscriptionStatus.cancelAtPeriodEnd}
                        subscriptionEndDate={subscriptionStatus.currentPeriodEnd}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Storage Management
                </CardTitle>
                <CardDescription className="text-sm">
                  Free up space and manage your files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={handleEmptyTrash}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Empty Trash
                </Button>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="autoDelete"
                    checked={settings.autoDelete}
                    onCheckedChange={(c) => handleUpdate("autoDelete", c)}
                  />
                  <Label htmlFor="autoDelete" className="text-sm">
                    Auto-delete files in trash after 30 days
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-sm">
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications" className="text-sm">
                      Email notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(c) => handleUpdate("emailNotifications", c)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="desktop-notifications" className="text-sm">
                      Desktop notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show notifications on your desktop
                    </p>
                  </div>
                  <Switch
                    id="desktop-notifications"
                    checked={settings.desktopNotifications}
                    onCheckedChange={(c) => handleUpdate("desktopNotifications", c)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional Settings Tabs like Privacy, Advanced could be added here following same pattern */}

          <TabsContent value="privacy" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  Privacy Settings
                </CardTitle>
                <CardDescription className="text-sm">
                  Danger zone and irreversible actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Export All Data
                </Button>
                <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default SettingsView;
