
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authUtils';

export const useAuthOperations = (setIsLoading: (loading: boolean) => void) => {
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting login with email:', email);
      
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      console.log('Login successful:', data.user?.email);
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
      
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting registration with:', { name, email });
      
      // Clean up existing state
      cleanupAuthState();
      
      // Extract phone number from email if it follows our format
      const phone = email.includes('@phone.local') ? email.replace('@phone.local', '') : null;
      
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name,
            name: name,
            phone: phone,
            verified_via_otp: phone ? true : false
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        throw error;
      }
      
      console.log('Registration successful:', data.user?.email);
      console.log('User metadata:', data.user?.user_metadata);
      
      // For phone users or users with confirmed emails, redirect immediately
      if (phone || data.user?.email_confirmed_at) {
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        // For email users, they need to confirm their email first
        console.log('Email confirmation required for:', email);
      }
      
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user...');
      
      // Clean up auth state
      cleanupAuthState();
      
      // Clear Firebase recaptcha if it exists
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
          delete (window as any).recaptchaVerifier;
        } catch (error) {
          console.log('Error clearing Firebase recaptcha on logout:', error);
        }
      }
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors
      }
      
      // Force page reload for clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return { login, register, logout };
};
