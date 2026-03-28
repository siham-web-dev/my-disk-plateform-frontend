"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getPricingPlans, getSubscriptionStatus } from "@/actions/plans";
import { UpgradePlansList, UpgradePlanProps } from "../containers/UpgradePlansList";
import { Camera, Crown, Edit, Loader2, LogOut, ShieldCheck, User as UserIcon, RefreshCw, KeyRound, MonitorSmartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getUserProfile, updateUserProfile, syncUser, getUserActivities, logActivity } from "@/actions/user";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import { formatDistanceToNow } from "date-fns";

const formatStorage = (bytes: string | number | bigint) => {
  const num = Number(bytes);
  if (num >= 1024 * 1024 * 1024) {
    return `${num / (1024 * 1024 * 1024)} GB`;
  }
  return `${num / (1024 * 1024)} MB`;
};

const AccountView = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    image: "",
    planName: "Free",
    planPrice: 0,
    planStorage: "40 MB",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [mfaStatus, setMfaStatus] = useState({
    enabled: false,
    enrolling: false,
    qrCode: "",
    factorId: "",
  });
  const [mfaCode, setMfaCode] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [availablePlans, setAvailablePlans] = useState<UpgradePlanProps[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: Date | null;
  }>({ status: "none", cancelAtPeriodEnd: false, currentPeriodEnd: null });

  const router = useRouter();

  const fetchActivities = async (userId: string) => {
    const data = await getUserActivities(userId);
    setActivities(data);
  };

  const checkMFA = async () => {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (data?.all?.length ?? 0 > 0) {
      const activeFactors = data?.all?.filter(f => f.status === 'verified') || [];
      setMfaStatus(prev => ({ ...prev, enabled: activeFactors.length > 0 }));
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await syncUser({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.user_metadata?.full_name,
        });

        const dbUser = await getUserProfile(user.id);

        setProfile({
          id: user.id,
          name: dbUser?.name || user.user_metadata?.name || "User",
          email: user.email || "",
          image: dbUser?.image || user.user_metadata?.avatar_url || "",
          planName: dbUser?.plan?.name || "Free",
          planPrice: dbUser?.plan?.price || 0,
          planStorage: dbUser?.plan?.storageLimit ? formatStorage(dbUser.plan.storageLimit.toString()) : "40 MB",
        });
        console.log("db user = ", dbUser);


        await fetchActivities(user.id);
        await checkMFA();

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
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!profile.id) return;
    setIsSaving(true);
    const result = await updateUserProfile(profile.id, {
      name: profile.name,
    });

    if (result.success) {
      await supabase.auth.updateUser({
        data: { name: profile.name }
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } else {
      toast.error(result.error || "Failed to update profile. Please try again.");
    }
    setIsSaving(false);
  };

  const handlePasswordUpdate = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({
      password: passwords.newPassword,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully");
      await logActivity(profile.id, {
        type: "SECURITY",
        description: "Password updated"
      });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    setIsUpdatingPassword(false);
  };

  /*   const handleSignOut = async () => {
      await supabase.auth.signOut();
      router.push("/sign-in");
    }; */

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile.id) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    setIsUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const result = await updateUserProfile(profile.id, {
        image: publicUrl,
      });

      if (!result.success) throw new Error(result.error);

      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      setProfile((prev) => ({ ...prev, image: publicUrl }));
      toast.success("Profile picture updated!");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleMFAEnroll = async () => {
    try {
      setMfaStatus(prev => ({ ...prev, enrolling: true }));
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'MyDisk',
        friendlyName: 'MyDisk Authenticator'
      });

      if (error) throw error;

      setMfaStatus(prev => ({
        ...prev,
        qrCode: data.totp.uri,
        factorId: data.id
      }));
    } catch (error: any) {
      toast.error(error.message);
      setMfaStatus(prev => ({ ...prev, enrolling: false }));
    }
  };

  const handleMFAVerify = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: mfaStatus.factorId,
        code: mfaCode
      });

      if (error) throw error;

      toast.success("MFA enabled successfully!");
      setMfaStatus({
        enabled: true,
        enrolling: false,
        qrCode: "",
        factorId: "",
      });
      setMfaCode("");
      await logActivity(profile.id, {
        type: "SECURITY",
        description: "Two-Factor Authentication enabled"
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSignOutOfOthers = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'others' });
      if (error) throw error;

      toast.success("Signed out of all other sessions");
      await logActivity(profile.id, {
        type: "SECURITY",
        description: "All other sessions revoked"
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-auto p-3 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Account</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm">Security</TabsTrigger>
            <TabsTrigger value="billing" className="text-xs sm:text-sm hidden sm:block">Billing</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs sm:text-sm hidden sm:block">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-sm">
                  Update your personal information and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="relative">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                      <AvatarImage
                        src={profile.image || undefined}
                        alt="Profile picture"
                      />
                      <AvatarFallback className="text-base sm:text-lg">
                        {profile.name?.substring(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                      {isUploadingImage && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                          <Loader2 className="w-6 h-6 animate-spin text-white" />
                        </div>
                      )}
                    </Avatar>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                    >
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h3 className="text-lg font-semibold">{profile.name}</h3>
                    <p className="text-muted-foreground text-sm">{profile.email}</p>
                    <Badge variant="secondary" className="flex items-center gap-1 w-fit mx-auto sm:mx-0">
                      <Crown className="w-3 h-3" />
                      {profile.planName} Plan
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">Email Address</Label>
                    <Input id="email" type="email" value={profile.email} disabled={true} />
                    <p className="text-[10px] text-muted-foreground">Email cannot be changed here for security reasons.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} size="sm" disabled={isSaving}>
                        {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">Cancel</Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">Password & Authentication</CardTitle>
                <CardDescription className="text-sm">Manage your password and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>
                <Button size="sm" onClick={handlePasswordUpdate} disabled={isUpdatingPassword}>
                  {isUpdatingPassword && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Two-Factor Authentication</CardTitle>
                <CardDescription className="text-sm">Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!mfaStatus.enrolling ? (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Authenticator App</p>
                        <p className="text-xs text-muted-foreground">Use an app to generate codes</p>
                      </div>
                    </div>
                    {mfaStatus.enabled ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Enabled</Badge>
                    ) : (
                      <Button variant="outline" size="sm" onClick={handleMFAEnroll}>Setup</Button>
                    )}
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="flex flex-col items-center gap-4 text-center">
                      <p className="text-sm font-medium">Scan this QR code with your authenticator app</p>
                      <div className="p-2 bg-white rounded-lg">
                        <QRCodeSVG value={mfaStatus.qrCode} size={150} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mfaCode">Verification Code</Label>
                      <div className="flex gap-2">
                        <Input
                          id="mfaCode"
                          placeholder="000000"
                          value={mfaCode}
                          onChange={(e) => setMfaCode(e.target.value)}
                        />
                        <Button onClick={handleMFAVerify}>Verify</Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setMfaStatus(prev => ({ ...prev, enrolling: false }))} className="w-full">Cancel</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Active Sessions</CardTitle>
                <CardDescription className="text-sm">Manage your active login sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <MonitorSmartphone className="w-5 h-5 opacity-70" />
                      <div>
                        <p className="font-medium text-sm">Review Current Session</p>
                        <p className="text-xs text-muted-foreground">This device • Active now</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">Active</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full text-xs text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleSignOutOfOthers}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out of all other sessions
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">Current Plan</CardTitle>
                <CardDescription className="text-sm">Manage your subscription and billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{profile.planName} Plan</h3>
                      {subscriptionStatus.cancelAtPeriodEnd && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Cancels soon</span>
                      )}
                      {subscriptionStatus.status === "active" && !subscriptionStatus.cancelAtPeriodEnd && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                      )}
                      {subscriptionStatus.status === "past_due" && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Past due</span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">{profile.planStorage} storage & features</p>
                    {subscriptionStatus.currentPeriodEnd && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {subscriptionStatus.cancelAtPeriodEnd
                          ? `Access until: ${subscriptionStatus.currentPeriodEnd.toLocaleDateString()}`
                          : `Next billing: ${subscriptionStatus.currentPeriodEnd.toLocaleDateString()}`}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${profile.planPrice.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">/month</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">Upgrade Plan</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-6xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none">
                      <DialogHeader className="sr-only">
                        <DialogTitle>Choose Your Plan</DialogTitle>
                      </DialogHeader>
                      <div className="w-full max-w-[2000px] max-h-[85vh] overflow-y-auto rounded-xl shadow-2xl bg-white">
                        <UpgradePlansList
                          plans={availablePlans}
                          currentPlanName={profile.planName}
                          hasActiveSubscription={subscriptionStatus.status === "active" && !subscriptionStatus.cancelAtPeriodEnd}
                          subscriptionEndDate={subscriptionStatus.currentPeriodEnd}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  {profile.planPrice > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          const response = await fetch("/api/stripe/portal", { method: "GET" });
                          const data = await response.json();
                          if (data.url) {
                            window.location.href = data.url;
                          } else {
                            toast.error("Portal not configured");
                          }
                        } catch {
                          toast.error("Something went wrong");
                        }
                      }}
                    >
                      Manage Subscription
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">Recent Activity</CardTitle>
                <CardDescription className="text-sm">View your recent account activity logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          activity.type === "LOGIN" ? "bg-green-500" :
                            activity.type === "SECURITY" ? "bg-red-500" : "bg-blue-500"
                        )} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.type.replace('_', ' ')}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(activity.createdAt))} ago
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p>No recent activity found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default AccountView;
