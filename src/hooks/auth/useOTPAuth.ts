
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
    normalizePhoneNumber
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
      
      console.log('OTP verified successfully for:', phoneNumber);
      console.log('Firebase user:', firebaseUser.uid);
      
      // Authenticate with Supabase
      await authenticateOTPUser(phoneNumber, userName);
      
      toast({
        title: "Success!",
        description: "Phone number verified and signed in successfully!",
      });
      
      // Clear Firebase recaptcha
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
          delete (window as any).recaptchaVerifier;
        } catch (error) {
          console.log('Error clearing Firebase recaptcha on success:', error);
        }
      }
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
      
    } catch (error: any) {
      console.error('OTP success handling error:', error);
      
      toast({
        title: "Authentication Error", 
        description: "Failed to complete authentication. Please try again.",
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
