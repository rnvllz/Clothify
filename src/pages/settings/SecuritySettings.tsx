import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../../api/api';
import { Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const SecuritySettings: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const isResetRequired = searchParams.get('reset_required') === 'true';
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session?.user) {
          setUser(session.user);
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!newPassword || !confirmPassword) {
      setError('Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Update password in Supabase Auth
      const { error: updateError } = await authService.supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw new Error(updateError.message);

      // Clear the password_reset_required flag
      const { error: metadataError } = await authService.supabase.auth.updateUser({
        data: { password_reset_required: false }
      });

      if (metadataError) {
        console.warn('Warning: Could not clear reset flag:', metadataError);
      }

      toast.success('Password updated successfully!', { id: 'pwd-reset' });
      
      // Redirect based on user role
      const role = user?.user_metadata?.role;
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }

    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to update password');
      toast.error(err.message || 'Failed to update password', { id: 'pwd-error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 lg:py-0">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {isResetRequired && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">Password Reset Required</p>
                <p className="text-xs text-yellow-700 mt-1">
                  As a new member, you must reset your password to access your account.
                </p>
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-6 w-6 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
            </div>
            <p className="text-gray-600 text-sm">Update your password to secure your account</p>
          </div>

          <form onSubmit={handlePasswordReset} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter new password (min. 8 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-xs text-gray-700">
            <p className="font-semibold mb-2">Password Requirements:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>At least 8 characters long</li>
              <li>Include numbers and special characters for better security</li>
              <li>Do not reuse previous passwords</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12">
        <div className="text-center text-white">
          <Lock className="h-24 w-24 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl font-bold mb-4">Account Security</h2>
          <p className="text-lg opacity-90 max-w-md">
            Keep your account safe by using a strong, unique password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
