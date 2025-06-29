
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthFormData, AuthMode } from './types';

export const useFirebaseOTP = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const setupRecaptcha = async () => {
    try {
      const isProduction = window.location.hostname !== 'localhost';
      
      // Clear any existing recaptcha verifier
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (error) {
          console.log('Clearing existing recaptcha:', error);
        }
        delete (window as any).recaptchaVerifier;
      }

      // Ensure the container exists and is properly configured
      let recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        // Create container if it doesn't exist
        recaptchaContainer = document.createElement('div');
        recaptchaContainer.id = 'recaptcha-container';
        document.body.appendChild(recaptchaContainer);
        console.log('🔧 Created reCAPTCHA container');
      }

      // Clear container content to ensure clean state
      recaptchaContainer.innerHTML = '';
      
      // Wait a bit to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      // Production reCAPTCHA configuration
      const recaptchaConfig: any = {
        size: isProduction ? 'invisible' : 'normal',
        callback: (response: string) => {
          console.log('✅ reCAPTCHA solved successfully');
          console.log('✅ Token length:', response ? response.length : 'No token');
          if (!response) {
            console.error('❌ reCAPTCHA callback received empty response!');
          }
        },
        'expired-callback': () => {
          console.warn('⚠️ reCAPTCHA expired');
          toast({
            title: "Verification Expired",
            description: "Please try again to verify you're human.",
            variant: "destructive",
          });
        },
        'error-callback': (error: any) => {
          console.error('❌ reCAPTCHA error:', error);
          toast({
            title: "Verification Error",
            description: "reCAPTCHA verification failed. Please refresh and try again.",
            variant: "destructive",
          });
        }
      };

      // Add isolated parameter for production to avoid conflicts
      if (isProduction) {
        recaptchaConfig.isolated = true;
      }

      console.log(`🔒 Creating reCAPTCHA verifier for ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}...`);
      
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', recaptchaConfig);
      (window as any).recaptchaVerifier = verifier;
      
      // Always render the reCAPTCHA to ensure it's properly initialized
      console.log('🎯 Rendering reCAPTCHA...');
      const widgetId = await verifier.render();
      console.log('✅ reCAPTCHA rendered with widget ID:', widgetId);
      
      // Verify the verifier is properly set up
      if (!verifier) {
        throw new Error('reCAPTCHA verifier failed to initialize');
      }
      
      return verifier;
    } catch (error) {
      console.error('❌ reCAPTCHA setup failed:', error);
      
      // Clean up on error
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
          delete (window as any).recaptchaVerifier;
        } catch (cleanupError) {
          console.log('Error during reCAPTCHA cleanup:', cleanupError);
        }
      }
      
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

      console.log('🔒 Setting up reCAPTCHA...');
      const appVerifier = await setupRecaptcha();
      
      // Add a small delay to ensure reCAPTCHA is fully ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('📤 Attempting to send OTP with Firebase...');
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      console.log('✅ OTP sent successfully');
      
      setConfirmationResult(result);
      setAuthMode('otp');
      
      toast({
        title: "OTP sent!",
        description: `Verification code sent to ${phoneNumber}`,
      });
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

      // Clear the recaptcha verifier on error
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
          delete (window as any).recaptchaVerifier;
        } catch (clearError) {
          console.log('Error clearing recaptcha after failure:', clearError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    sendOTP, 
    confirmationResult, 
    setConfirmationResult,
    isLoading,
    normalizePhoneNumber
  };
};
