
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseAuth = () => {
  const { register } = useAuth();
  const { toast } = useToast();

  const authenticateOTPUser = async (phoneNumber: string, userName: string) => {
    try {
      console.log('🔑 Authenticating OTP user:', phoneNumber);
      
      const email = `${phoneNumber}@phone.local`;
      const password = `otp-verified-${phoneNumber.replace(/[^0-9]/g, '')}`;
      
      // Clean up existing auth state
      try {
        await supabase.auth.signOut({ scope: 'global' });
        console.log('✅ Existing session cleared');
      } catch (err) {
        console.log('⚠️ Error signing out existing session:', err);
      }
      
      // Small delay to ensure cleanup completed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user already exists in profiles table
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, phone, email')
        .eq('phone', phoneNumber)
        .single();
      
      console.log('📊 Existing profile check:', existingProfile);
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('❌ Error checking existing profile:', profileError);
      }
      
      if (existingProfile) {
        console.log('👤 Existing user found, signing in...');
        
        // Try to sign in first
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.log('⚠️ Sign in failed, attempting to create auth user:', signInError.message);
          
          // If sign in fails, try to sign up (user might exist in profiles but not in auth)
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: existingProfile.full_name || userName,
                phone: phoneNumber,
                verified_via_otp: true
              },
              emailRedirectTo: undefined // Disable email verification
            }
          });
          
          if (signUpError && !signUpError.message.includes('User already registered')) {
            throw signUpError;
          }
          
          // If signup succeeded but user needs confirmation, auto-confirm for OTP users
          if (signUpData?.user && !signUpData.session) {
            console.log('🔄 User created but needs confirmation, attempting sign in...');
            
            // Try signing in again after a short delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            const { error: retrySignInError } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            
            if (retrySignInError) {
              console.error('❌ Retry sign in failed:', retrySignInError);
              throw new Error('Failed to establish session after OTP verification');
            }
          }
        } else {
          console.log('✅ Successfully signed in existing user');
        }
      } else {
        console.log('👤 New user detected, registering...');
        
        // Use the register function from auth context
        await register(userName, email, password);
        
        console.log('✅ New user registered successfully');
      }
      
      // Verify session was created
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Error getting session:', sessionError);
        throw sessionError;
      }
      
      if (!session) {
        console.error('❌ No session found after authentication');
        throw new Error('Failed to create authenticated session');
      }
      
      console.log('✅ Session verified:', session.user.email);
      return { success: true, session };
      
    } catch (error: any) {
      console.error('❌ Supabase auth error:', error);
      
      if (error.message?.includes('User already registered')) {
        // User exists, try to sign in instead
        console.log('🔄 User exists, attempting sign in...');
        
        const email = `${phoneNumber}@phone.local`;
        const password = `otp-verified-${phoneNumber.replace(/[^0-9]/g, '')}`;
        
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          throw signInError;
        }
        
        return { success: true };
      }
      
      throw error;
    }
  };

  return { authenticateOTPUser };
};
