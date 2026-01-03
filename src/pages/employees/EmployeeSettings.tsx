import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ChangePasswordModal } from '@/components/ChangePasswordModal';
import { useOnboarding } from '@/hooks/use-onboarding';

const EmployeeSettings: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { needsOnboarding } = useOnboarding();

  useEffect(() => {
    if (needsOnboarding) setModalOpen(true);
  }, [needsOnboarding]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-6">
        <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8" />
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              Profile Information
            </CardTitle>
            <CardDescription className="text-sm">View and update your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full-name" className="text-sm font-medium">Full Name</Label>
              <Input id="full-name" disabled defaultValue="John Employee" className="w-full" />
              <p className="text-xs text-muted-foreground">Contact your admin to change this</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input id="email" type="email" disabled defaultValue="employee@clothify.com" className="w-full" />
              <p className="text-xs text-muted-foreground">Contact your admin to change this</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">Role</Label>
              <Input id="role" disabled defaultValue="Sales Employee" className="w-full" />
              <p className="text-xs text-muted-foreground">Your role is managed by administrators</p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              Notifications
            </CardTitle>
            <CardDescription className="text-sm">Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive emails for order updates</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Task Notifications</Label>
                <p className="text-xs text-muted-foreground">Get notified about assigned tasks</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">In-App Notifications</Label>
                <p className="text-xs text-muted-foreground">Show notifications in the app</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
              Security
            </CardTitle>
            <CardDescription className="text-sm">Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="change-password" className="text-sm font-medium">Change Password</Label>
              <p className="text-xs text-muted-foreground">Use the button below to update your password.</p>
            </div>

            <Button className="w-full" onClick={() => setModalOpen(true)}>
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Account Information</CardTitle>
            <CardDescription className="text-sm">View your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 text-sm">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Account Status</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Member Since</span>
              <span className="font-medium">January 15, 2025</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Last Login</span>
              <span className="font-medium">Today at 2:30 PM</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Account Type</span>
              <span className="font-medium">Employee</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex gap-3 justify-end">
        <Button variant="outline">Cancel</Button>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <ChangePasswordModal isOpen={modalOpen} onClose={() => setModalOpen(false)} requireCurrentPassword={false} redirectTo="/" />
    </div>
  );
};

export default EmployeeSettings;
