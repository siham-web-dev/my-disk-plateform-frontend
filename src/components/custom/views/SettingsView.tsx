"use client";
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
  Bell,
  Download,
  HardDrive,
  Monitor,
  Palette,
  Shield,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useState } from "react";

const SettingsView = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    desktop: false,
    mobile: true,
    sharing: true,
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    activityStatus: true,
    dataCollection: false,
  });

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
            <TabsTrigger
              value="privacy"
              className="text-xs sm:text-sm hidden sm:block"
            >
              Privacy
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="text-xs sm:text-sm hidden sm:block"
            >
              Advanced
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
                  <Select defaultValue="system">
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-sm">
                    Language
                  </Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-sm">
                    Timezone
                  </Label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="cet">Central European Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
                  Default View
                </CardTitle>
                <CardDescription className="text-sm">
                  Set your preferred file view mode
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultView" className="text-sm">
                    Default file view
                  </Label>
                  <Select defaultValue="grid">
                    <SelectTrigger>
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid view</SelectItem>
                      <SelectItem value="list">List view</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="autoPreview" />
                  <Label htmlFor="autoPreview" className="text-sm">
                    Auto-preview files on hover
                  </Label>
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
                    <span>15 GB of 100 GB</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: "15%" }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-sm">Documents</span>
                    </div>
                    <p className="text-sm text-muted-foreground">8.2 GB</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-sm">Images</span>
                    </div>
                    <p className="text-sm text-muted-foreground">4.1 GB</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="text-sm">Videos</span>
                    </div>
                    <p className="text-sm text-muted-foreground">2.3 GB</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full" />
                      <span className="text-sm">Other</span>
                    </div>
                    <p className="text-sm text-muted-foreground">0.4 GB</p>
                  </div>
                </div>
                <Button className="w-full mt-4">Upgrade Storage</Button>
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
                <Button variant="outline" className="w-full justify-start">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Empty Trash (2.1 GB)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download All Files
                </Button>
                <div className="flex items-center space-x-2">
                  <Switch id="autoDelete" />
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
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, email: checked }))
                    }
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
                    checked={notifications.desktop}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        desktop: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="mobile-notifications" className="text-sm">
                      Mobile notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications on mobile
                    </p>
                  </div>
                  <Switch
                    id="mobile-notifications"
                    checked={notifications.mobile}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, mobile: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sharing-notifications" className="text-sm">
                      Sharing notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when files are shared with you
                    </p>
                  </div>
                  <Switch
                    id="sharing-notifications"
                    checked={notifications.sharing}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        sharing: checked,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  Privacy Settings
                </CardTitle>
                <CardDescription className="text-sm">
                  Control your privacy and data sharing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-profile" className="text-sm">
                      Public profile
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Make your profile visible to others
                    </p>
                  </div>
                  <Switch
                    id="public-profile"
                    checked={privacy.publicProfile}
                    onCheckedChange={(checked) =>
                      setPrivacy((prev) => ({
                        ...prev,
                        publicProfile: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="activity-status" className="text-sm">
                      Activity status
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show when {"you're"} online
                    </p>
                  </div>
                  <Switch
                    id="activity-status"
                    checked={privacy.activityStatus}
                    onCheckedChange={(checked) =>
                      setPrivacy((prev) => ({
                        ...prev,
                        activityStatus: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-collection" className="text-sm">
                      Data collection
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow analytics and usage data collection
                    </p>
                  </div>
                  <Switch
                    id="data-collection"
                    checked={privacy.dataCollection}
                    onCheckedChange={(checked) =>
                      setPrivacy((prev) => ({
                        ...prev,
                        dataCollection: checked,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  Sharing Defaults
                </CardTitle>
                <CardDescription className="text-sm">
                  Set default permissions for shared files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultPermission" className="text-sm">
                    Default sharing permission
                  </Label>
                  <Select defaultValue="view">
                    <SelectTrigger>
                      <SelectValue placeholder="Select permission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View only</SelectItem>
                      <SelectItem value="comment">Can comment</SelectItem>
                      <SelectItem value="edit">Can edit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="requireAuth" defaultChecked />
                  <Label htmlFor="requireAuth" className="text-sm">
                    Require authentication for shared links
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  Upload Settings
                </CardTitle>
                <CardDescription className="text-sm">
                  Configure file upload behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="uploadQuality" className="text-sm">
                    Image upload quality
                  </Label>
                  <Select defaultValue="original">
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">Original</SelectItem>
                      <SelectItem value="high">High quality</SelectItem>
                      <SelectItem value="medium">Medium quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="autoSync" defaultChecked />
                  <Label htmlFor="autoSync" className="text-sm">
                    Auto-sync files
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="offlineAccess" />
                  <Label htmlFor="offlineAccess" className="text-sm">
                    Enable offline access
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-sm">
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Export All Data
                </Button>
                <Button variant="destructive" className="w-full">
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
