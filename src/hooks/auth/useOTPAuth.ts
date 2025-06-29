
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthFormData, AuthMode } from './types';
import { useFirebaseOTP } from './useFirebaseOTP';
import { useSimulatedOTP } from './useSimulatedOTP';
import { useSupabaseAuth } from './useSupabaseAuth';

export const useOTPAuth = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [otpMode, setOtpMode] = useState<'firebase' | 'simulated'>('firebase');
  
  const { 
    sendOTP: firebaseSendOTP, 
    confirmationResult: firebaseConfirmationResult, 
    setConfirmationResult: setFirebaseConfirmationResult,
    isLoading: firebaseLoading,
    normalizePhoneNumber
  } = useFirebaseOTP();
  
  const { 
    sendOTP: simulatedSendOTP, 
    confirmationResult: simulatedConfirmationResult, 
    setConfirmationResult: setSimulatedConfirmationResult,
    isLoading: simulatedLoading,
    testPhoneNumbers
  } = useSimulatedOTP();
  
  const { authenticateOTPUser } = useSupabaseAuth();
  
  // Adaptive confirmation result based on current mode
  const confirmationResult = otpMode === 'firebase' ? firebaseConfirmationResult : simulatedConfirmationResult;
  const setConfirmationResult = otpMode === 'firebase' ? setFirebaseConfirmationResult : setSimulatedConfirmationResult;

  const handleSendOTP = async (
    e: React.FormEvent,
    formData: AuthFormData,
    setAuthMode: (mode: AuthMode) => void
  ) => {
    e.preventDefault();
    
    // Auto-detect which mode to use based on environment and phone number
    const phoneNumber = normalizePhoneNumber(formData.countryCode, formData.phoneNumber);
    const isTestPhone = phoneNumber in testPhoneNumbers;
    const isLocalhost = window.location.hostname === 'localhost';
    
    console.log('🔄 OTP Mode Selection:');
    console.log('- Phone number:', phoneNumber);
    console.log('- Is test phone:', isTestPhone);
    console.log('- Is localhost:', isLocalhost);
    
    // Decision logic:
    // 1. If test phone number and localhost -> use simulation
    // 2. Otherwise -> try Firebase first
    if (isTestPhone && isLocalhost) {
      console.log('📱 Using SIMULATED OTP for test phone number');
      setOtpMode('simulated');
      await simulatedSendOTP(formData, setAuthMode);
    } else {
      console.log('🔥 Using FIREBASE OTP');
      setOtpMode('firebase');
      try {
        await firebaseSendOTP(formData, setAuthMode);
      } catch (error: any) {
        console.error('Firebase OTP failed:', error);
        
        // If Firebase fails and we're on localhost with a test number, fallback to simulation
        if (isLocalhost && isTestPhone && 
            (error.code === 'auth/captcha-check-failed' || 
             error.code === 'auth/unauthorized-domain' ||
             error.code === 'auth/invalid-app-credential')) {
          
          console.log('🔄 Firebase failed, falling back to SIMULATED OTP');
          toast({
            title: "Switching to Test Mode",
            description: "Firebase failed, using simulated OTP for testing",
            variant: "default",
          });
          
          setOtpMode('simulated');
          await simulatedSendOTP(formData, setAuthMode);
        } else {
          // Re-throw the error if we can't fallback
          throw error;
        }
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
