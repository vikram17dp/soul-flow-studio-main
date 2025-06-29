
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthFormData, AuthMode } from './types';
import useRecaptchaManager from '@/hooks/useRecaptchaManager';

export const useFirebaseOTP = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  // Use the robust reCAPTCHA manager
  const { 
    setupRecaptcha, 
    resetRecaptcha, 
    isInitialized: recaptchaInitialized,
    isRendering: recaptchaRendering 
  } = useRecaptchaManager(auth, {
    onSuccess: (response) => {
      console.log('✅ reCAPTCHA solved via manager:', response?.length || 0);
      toast({
        title: "reCAPTCHA Solved",
        description: "Verification completed successfully.",
      });
    },
    onExpired: () => {
      toast({
        title: "Verification Expired",
        description: "Please solve the reCAPTCHA again.",
        variant: "destructive",
      });
    },
    onError: (error) => {
      console.error('❌ reCAPTCHA error via manager:', error);
      toast({
        title: "Verification Error",
        description: "reCAPTCHA verification failed. Please refresh and try again.",
        variant: "destructive",
      });
    }
  });

  // Use the manager's reset function instead of custom clear logic
  const clearRecaptcha = resetRecaptcha;

  // Use the manager's setup function instead of custom setup logic
  const setupRecaptchaWrapper = async () => {
    try {
      console.log('🔧 Setting up reCAPTCHA using manager...');
      const verifier = await setupRecaptcha();
      
      if (!verifier) {
        console.log('🚫 No reCAPTCHA verifier created (likely localhost with testing disabled)');
        return null;
      }
      
      console.log('✅ reCAPTCHA setup completed via manager');
      return verifier;
    } catch (error: any) {
      console.error('❌ reCAPTCHA manager setup failed:', error);
      throw new Error(`Failed to initialize phone verification: ${error.message}`);
    }
  };
  const logRecaptchaVerifierSuccess = () => {
    console.log('reCAPTCHA solved successfully');
    toast({
      title: "reCAPTCHA Solved",
      description: "Verification completed successfully.",
    });
  };
  
  const normalizePhoneNumber = (countryCode: string, phoneNumber: string) => {
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const cleanCountryCode = countryCode.startsWith('+') ? countryCode : '+' + countryCode;
    return cleanCountryCode + cleanPhone;
  };

  const sendOTP = async (formData: AuthFormData, setAuthMode: (mode: AuthMode) => void) => {
    let phoneNumber = '';
    try {
      setIsLoading(true);
      console.log('🚀 Starting OTP send process...');
      
      phoneNumber = normalizePhoneNumber(formData.countryCode, formData.phoneNumber);
      console.log('📱 Normalized phone number:', phoneNumber);

      if (!phoneNumber || phoneNumber.length < 10) {
        throw new Error('Please enter a valid phone number');
      }

      const isLocalhost = window.location.hostname === 'localhost';
      
      if (isLocalhost && auth.settings.appVerificationDisabledForTesting) {
        console.log('🚫 Using localhost mode - no reCAPTCHA required');
        
        // For localhost with app verification disabled, pass null as verifier
        console.log('📤 Attempting to send OTP with Firebase (localhost mode)...');
        const result = await signInWithPhoneNumber(auth, phoneNumber, null as any);
        console.log('✅ OTP sent successfully (localhost mode)');
        
        setConfirmationResult(result);
        setAuthMode('otp');
        
        toast({
          title: "OTP sent!",
          description: `Verification code sent to ${phoneNumber}`,
        });
      } else {
        console.log('🔒 Setting up reCAPTCHA for production/non-localhost...');
        const appVerifier = await setupRecaptchaWrapper();
        
        if (!appVerifier) {
          throw new Error('Failed to initialize reCAPTCHA verifier');
        }
        
        // Add a small delay to ensure reCAPTCHA is fully ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('📤 Attempting to send OTP with Firebase (production mode)...');
        const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        console.log('✅ OTP sent successfully (production mode)');
        
        setConfirmationResult(result);
        setAuthMode('otp');
        
        toast({
          title: "OTP sent!",
          description: `Verification code sent to ${phoneNumber}`,
        });
      }
    } catch (error: any) {
      console.error('OTP send error:', error);
      
      let errorMessage = "Failed to send OTP. Please try again.";
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = "Invalid phone number format. Please check and try again.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many attempts. Please wait a few minutes before trying again.";
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "This domain is not authorized for Firebase authentication. Please contact support.";
      } else if (error.code === 'auth/captcha-check-failed') {
        errorMessage = "reCAPTCHA verification failed. Please try again.";
        console.log('🔧 reCAPTCHA DEBUGGING:');
        console.log('1. Check if reCAPTCHA container exists');
        console.log('2. Verify reCAPTCHA is solved before clicking send');
        console.log('3. Try refreshing the page and solving reCAPTCHA again');
      }
      
      // Enhanced error reporting for debugging
      console.error('Firebase Auth Error Details:', {
        code: error.code,
        message: error.message,
        phoneNumber: phoneNumber || 'undefined',
        domain: window.location.hostname,
        authDomain: 'shuddha-32217.firebaseapp.com'
      });
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Additional debugging info
      if (error.code === 'auth/invalid-app-credential') {
        console.log('🔧 DEBUGGING INFO:');
        console.log('1. Current domain:', window.location.hostname);
        console.log('2. Check Firebase Console → Authentication → Settings → Authorized domains');
        console.log('3. Ensure "localhost" is added to authorized domains');
        console.log('4. Try using test phone number: +91-1234567890 with OTP: 123456');
      }

      // Clear the recaptcha verifier on error using manager
      try {
        clearRecaptcha();
      } catch (clearError) {
        console.log('Error clearing recaptcha after failure:', clearError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    sendOTP, 
    confirmationResult, 
    setConfirmationResult,
    isLoading: isLoading || recaptchaRendering,
    normalizePhoneNumber,
    clearRecaptcha, // Expose cleanup function
    recaptchaInitialized,
    recaptchaRendering
  };
};
