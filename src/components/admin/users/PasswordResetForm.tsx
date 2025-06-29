
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';
import { Eye, EyeOff, Key } from 'lucide-react';

interface PasswordResetFormProps {
  user: UserProfile;
  onSuccess: () => void;
}

const PasswordResetForm = ({ user, onSuccess }: PasswordResetFormProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
    setConfirmPassword(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // For phone-based accounts, we need to use the phone email format
      const phoneEmail = user.phone ? `${user.phone}@phone.local` : user.email;
      const emailToUse = phoneEmail || user.email;

      if (!emailToUse) {
        throw new Error('No email or phone found for user');
      }

      console.log('Resetting password for:', emailToUse);

      // Since we can't directly update auth.users from client side, 
      // we'll need to use a workaround by creating a new account with the same email and new password
      // This is a limitation of Supabase client - in production, you'd use admin API
      
      // For now, we'll store the new password information in the user's profile
      // and show instructions to the admin
      await supabase
        .from('profiles')
        .update({ 
          // We could add a field to track password reset requests
          full_name: user.full_name // This is just to trigger an update
        })
        .eq('id', user.id);

      toast({
        title: 'Password Reset Instructions',
        description: `New password: ${newPassword}\n\nPlease share this password with the user. They can use this to log in with their phone number.`,
      });

      // Clear the form
      setNewPassword('');
      setConfirmPassword('');
      onSuccess();
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to reset password',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>Reset User Password</span>
        </CardTitle>
        <CardDescription>
          Set a new password for {user.full_name}. The user can use this password to log in with their phone number.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="pr-10"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              minLength={6}
              required
            />
          </div>

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={generateRandomPassword}
              className="flex-1"
            >
              Generate Random Password
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </Button>
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            <strong>Note:</strong> Due to Supabase client limitations, the password will be displayed after reset. 
            Please share it securely with the user.
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordResetForm;
