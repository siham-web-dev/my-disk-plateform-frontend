"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Camera, Crown, Edit, User } from "lucide-react";
import { useState } from "react";

const AccountView = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Product designer passionate about creating intuitive user experiences.",
  });

  const handleSave = () => {
    setIsEditing(false);
  };

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
            <TabsTrigger value="profile" className="text-xs sm:text-sm">
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm">
              Security
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="text-xs sm:text-sm hidden sm:block"
            >
              Billing
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="text-xs sm:text-sm hidden sm:block"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
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
                        src="/placeholder.svg?height=96&width=96"
                        alt="Profile picture"
                      />
                      <AvatarFallback className="text-base sm:text-lg">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8"
                    >
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h3 className="text-lg font-semibold">{profile.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {profile.email}
                    </p>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 w-fit mx-auto sm:mx-0"
                    >
                      <Crown className="w-3 h-3" />
                      Pro Plan
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} size="sm">
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        size="sm"
                      >
                        Cancel
                      </Button>
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
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  Password & Authentication
                </CardTitle>
                <CardDescription className="text-sm">
                  Manage your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-sm">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
                <Button size="sm">Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription className="text-sm">
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 sm:w-4 sm:h-4" />
                    <div>
                      <p className="font-medium text-sm">Authenticator App</p>
                      <p className="text-xs text-muted-foreground">
                        Use an app to generate codes
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 sm:w-4 sm:h-4" />
                    <div>
                      <p className="font-medium text-sm">SMS</p>
                      <p className="text-xs text-muted-foreground">
                        Receive codes via text message
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Setup
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Active Sessions
                </CardTitle>
                <CardDescription className="text-sm">
                  Manage your active login sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 sm:w-4 sm:h-4" />
                      <div>
                        <p className="font-medium text-sm">Chrome on Windows</p>
                        <p className="text-xs text-muted-foreground">
                          San Francisco, CA • Current session
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 sm:w-4 sm:h-4" />
                      <div>
                        <p className="font-medium text-sm">Mobile App</p>
                        <p className="text-xs text-muted-foreground">
                          San Francisco, CA • 2 hours ago
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      Revoke
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full text-xs">
                  Sign out of all other sessions
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  Current Plan
                </CardTitle>
                <CardDescription className="text-sm">
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                  <div>
                    <h3 className="font-semibold text-lg sm:text-xl">
                      Pro Plan
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      100 GB storage • Advanced features
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Next billing: January 15, 2024
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold sm:text-xl">$9.99</p>
                    <p className="text-sm text-muted-foreground">/month</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Upgrade Plan</Button>
                  <Button variant="outline" size="sm">
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  Payment Methods
                </CardTitle>
                <CardDescription className="text-sm">
                  Manage your payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 sm:w-4 sm:h-4" />
                    <div>
                      <p className="font-medium text-sm">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">
                        Expires 12/25
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Default
                  </Badge>
                </div>
                <Button variant="outline" className="w-full text-xs">
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Billing History
                </CardTitle>
                <CardDescription className="text-sm">
                  View your past invoices and payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: "Dec 15, 2023", amount: "$9.99", status: "Paid" },
                    { date: "Nov 15, 2023", amount: "$9.99", status: "Paid" },
                    { date: "Oct 15, 2023", amount: "$9.99", status: "Paid" },
                  ].map((invoice, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{invoice.date}</p>
                        <p className="text-xs text-muted-foreground">
                          Pro Plan
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{invoice.amount}</p>
                        <Badge variant="secondary" className="text-xs">
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-sm">
                  View your recent account activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "File uploaded",
                      details: "presentation.pptx",
                      time: "2 hours ago",
                    },
                    {
                      action: "Password changed",
                      details: "Security update",
                      time: "1 day ago",
                    },
                    {
                      action: "File shared",
                      details: "Project folder with team@company.com",
                      time: "3 days ago",
                    },
                    {
                      action: "Login",
                      details: "Chrome on Windows",
                      time: "1 week ago",
                    },
                    {
                      action: "Storage upgraded",
                      details: "Pro plan activated",
                      time: "2 weeks ago",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 border rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.details}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  ))}
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
