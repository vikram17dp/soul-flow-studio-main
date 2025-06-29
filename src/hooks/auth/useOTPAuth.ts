
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthFormData, AuthMode } from './types';
import { useFirebaseOTP } from './useFirebaseOTP';
import { useSupabaseAuth } from './useSupabaseAuth';

export const useOTPAuth = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    sendOTP: firebaseSendOTP, 
    confirmationResult, 
    setConfirmationResult,
    isLoading: firebaseLoading,
    normalizePhoneNumber,
    clearRecaptcha
  } = useFirebaseOTP();
  
  const { authenticateOTPUser } = useSupabaseAuth();

  const handleSendOTP = async (
    e: React.FormEvent,
    formData: AuthFormData,
    setAuthMode: (mode: AuthMode) => void
  ) => {
    e.preventDefault();
    
    console.log('🚀 Starting Firebase OTP authentication...');
    console.log('Environment:', window.location.hostname === 'localhost' ? 'Development' : 'Production');
    
    try {
      await firebaseSendOTP(formData, setAuthMode);
    } catch (error: any) {
      console.error('❌ Firebase OTP failed:', error);
      
      // Enhanced error handling for production
      if (error.code === 'auth/network-request-failed') {
        toast({
          title: "Network Error",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else if (error.code === 'auth/captcha-check-failed') {
        toast({
          title: "Verification Failed",
          description: "Please complete the reCAPTCHA verification and try again.",
          variant: "destructive",
        });
      } else {
        // Re-throw the error to show the original Firebase error message
        throw error;
      }
    }
  };

  const handleOTPSuccess = async (firebaseUser: any, formData: AuthFormData, authMode: AuthMode) => {
    try {
      setIsLoading(true);
      
      const phoneNumber = normalizePhoneNumber(formData.countryCode, formData.phoneNumber);
      const userName = formData.name?.trim() || 'Phone User';
      
      console.log('✅ OTP verified successfully for:', phoneNumber);
      console.log('🔥 Firebase user:', firebaseUser.uid);
      
      // Authenticate with Supabase and wait for session creation
      const authResult = await authenticateOTPUser(phoneNumber, userName);
      
      if (authResult?.success) {
        console.log('✅ Supabase authentication successful');
        
        toast({
          title: "Success!",
          description: "Phone number verified and signed in successfully!",
        });
        
        // Clear Firebase recaptcha using the proper cleanup function
        clearRecaptcha();
        
        // Wait for auth context to update (give it time to process the session)
        console.log('⏳ Waiting for auth context to update...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Use React Router navigate instead of hard redirect to preserve state
        console.log('🚀 Redirecting to dashboard...');
        
        // Check if we're in a React app with routing
        if (typeof window !== 'undefined' && window.history) {
          // Use history API for SPA navigation
          window.history.pushState({}, '', '/dashboard');
          window.dispatchEvent(new PopStateEvent('popstate'));
        } else {
          // Fallback to hard redirect
          window.location.href = '/dashboard';
        }
      } else {
        throw new Error('Authentication failed - no session created');
      }
      
    } catch (error: any) {
      console.error('❌ OTP success handling error:', error);
      
      // Clear any partial auth state
      clearRecaptcha();
      
      let errorMessage = "Failed to complete authentication. Please try again.";
      
      if (error.message?.includes('Failed to create authenticated session')) {
        errorMessage = "Session creation failed. Please try signing in again.";
      } else if (error.message?.includes('User already registered')) {
        errorMessage = "Account exists. Please try signing in with your existing credentials.";
      }
      
      toast({
        title: "Authentication Error", 
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    handleSendOTP, 
    handleOTPSuccess, 
    confirmationResult, 
    setConfirmationResult,
    isLoading: isLoading || firebaseLoading
  };
};
