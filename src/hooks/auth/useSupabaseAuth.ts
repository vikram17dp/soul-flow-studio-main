
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseAuth = () => {
  const { register } = useAuth();
  const { toast } = useToast();

  const authenticateOTPUser = async (phoneNumber: string, userName: string) => {
    try {
      console.log('Authenticating OTP user:', phoneNumber);
      
      const email = `${phoneNumber}@phone.local`;
      
      // Clean up existing auth state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Error signing out existing session:', err);
      }
      
      // Check if user already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, full_name, phone, email')
        .eq('phone', phoneNumber)
        .single();
      
      console.log('Existing profile check:', existingProfile);
      
      if (existingProfile) {
        // User exists - create auth user
        console.log('Existing user found, creating auth session...');
        
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password: `otp-verified-${phoneNumber}-${Date.now()}`,
          options: {
            data: {
              full_name: existingProfile.full_name || userName,
              phone: phoneNumber,
              verified_via_otp: true
            }
          }
        });
        
        if (signUpError && !signUpError.message.includes('User already registered')) {
          throw signUpError;
        }
      } else {
        // New user - register them
        console.log('New user detected, registering...');
        await register(userName, email, `otp-verified-${phoneNumber}-${Date.now()}`);
      }
      
      return true;
    } catch (error: any) {
      console.error('Supabase auth error:', error);
      
      if (error.message?.includes('User already registered')) {
        // User exists, still consider it success
        return true;
      }
      
      throw error;
    }
  };

  return { authenticateOTPUser };
};
