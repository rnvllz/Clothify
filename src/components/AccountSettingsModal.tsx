import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Key, Bell, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { supabase } from '@/api/api';
import toast from 'react-hot-toast';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'admin' | 'employee';
}

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({ isOpen, onClose, userRole }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalName, setOriginalName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    taskNotifications: userRole === 'employee',
    marketingEmails: userRole === 'admin',
  });

  useEffect(() => {
    if (isOpen) {
      const getUser = async () => {
        try {
          setLoading(true);
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) throw error;
          if (user) {
            setUser(user);

            // Get user role and name from user_roles table
            const { data: userRoleData, error: roleError } = await supabase
              .from('user_roles')
              .select('name')
              .eq('user_id', user.id)
              .single();

            if (roleError) {
              console.error('❌ Error fetching user role/name:', roleError);
              // If the name column doesn't exist, it will fail here
              toast.error('Database setup incomplete. Please add the name column to user_roles table.', { id: 'account-db-incomplete' });
            }

            setFormData(prev => ({
              ...prev,
              email: user.email || '',
              name: userRoleData?.name || '',
            }));

            // Store the original name for change detection
            setOriginalName(userRoleData?.name || '');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          toast.error('Failed to load user information', { id: 'account-load-failed' });
        } finally {
          setLoading(false);
        }
      };
      getUser();
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateEmail = async () => {
    if (!formData.email || formData.email === user?.email) return;

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: formData.email });
      if (error) throw error;
      toast.success('Email update initiated. Please check your email to confirm the change.', { id: 'account-email-update' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update email', { id: 'account-email-update-failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateName = async () => {
    console.log('🔄 handleUpdateName called with name:', formData.name);
    console.log('👤 Current user:', user);

    if (!formData.name.trim()) {
      console.log('❌ Name is empty');
      toast.error('Name cannot be empty', { id: 'account-name-empty' });
      return;
    }

    if (!user?.id) {
      console.log('❌ No user ID');
      toast.error('User not authenticated', { id: 'account-not-authenticated' });
      return;
    }

    setSaving(true);
    console.log('📝 Starting name update...');

    try {
      console.log('🔍 Checking user_roles table...');
      // First check if the user exists in user_roles
      const { data: existingUser, error: checkError } = await supabase
        .from('user_roles')
        .select('user_id, name')
        .eq('user_id', user.id)
        .single();

      if (checkError) {
        console.error('❌ Error checking user in user_roles:', checkError);
        throw new Error(`User not found in roles table: ${checkError.message}`);
      }

      console.log('✅ User found in user_roles:', existingUser);

      const { data, error } = await supabase
        .from('user_roles')
        .update({ name: formData.name.trim() })
        .eq('user_id', user.id)
        .select();

      if (error) {
        console.error('❌ Update error:', error);
        throw error;
      }

      console.log('✅ Update successful, returned data:', data);
      toast.success('Name updated successfully', { id: 'account-name-updated' });

      // Update the original name so the button becomes disabled again
      setOriginalName(formData.name.trim());
    } catch (error: any) {
      console.error('❌ Failed to update name:', error);
      toast.error(error.message || 'Failed to update name', { id: 'account-name-update-failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all password fields', { id: 'account-password-fields' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match', { id: 'account-password-mismatch' });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long', { id: 'account-password-length' });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: formData.newPassword });
      if (error) throw error;

      toast.success('Password updated successfully', { id: 'account-password-updated' });
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password', { id: 'account-password-update-failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    // Reset form data when closing
    setFormData({
      name: originalName,
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      emailNotifications: true,
      taskNotifications: userRole === 'employee',
      marketingEmails: userRole === 'admin',
    });
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-150 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Settings
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading account information...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Settings
          </DialogTitle>
          <DialogDescription>
            Manage your account details, security settings, and notification preferences.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <div className="flex gap-2">
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your display name"
                  className="flex-1"
                />
                <Button
                  onClick={() => {
                    console.log('🖱️ Name save button clicked');
                    handleUpdateName();
                  }}
                  disabled={saving || !formData.name.trim() || formData.name.trim() === originalName.trim()}
                  variant="outline"
                  size="sm"
                >
                  {saving ? 'Saving...' : <Save className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This name will be displayed in the system
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button
                  onClick={handleUpdateEmail}
                  disabled={saving || formData.email === user?.email}
                  variant="outline"
                  size="sm"
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Current: {user?.email}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <Input
                id="role"
                value={userRole === 'admin' ? 'Administrator' : 'Employee'}
                disabled
                className="bg-muted"
              />
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <Button
              onClick={handleUpdatePassword}
              disabled={saving}
              className="w-full"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </Button>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive notifications about account activity and updates
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={formData.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
            </div>

            {userRole === 'employee' && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="task-notifications">Task Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications about assigned tasks and customer support tickets
                    </p>
                  </div>
                  <Switch
                    id="task-notifications"
                    checked={formData.taskNotifications}
                    onCheckedChange={(checked) => handleInputChange('taskNotifications', checked)}
                  />
                </div>
              </>
            )}

            {userRole === 'admin' && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive promotional emails and product updates
                    </p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={formData.marketingEmails}
                    onCheckedChange={(checked) => handleInputChange('marketingEmails', checked)}
                  />
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettingsModal;