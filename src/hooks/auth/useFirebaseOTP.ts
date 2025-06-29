
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthFormData, AuthMode } from './types';

export const useFirebaseOTP = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaInitialized, setRecaptchaInitialized] = useState(false);

  const clearRecaptcha = () => {
    console.log('🧹 Clearing reCAPTCHA...');
    
    // Clear Firebase reCAPTCHA verifier
    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
        console.log('✅ Firebase reCAPTCHA verifier cleared');
      } catch (error) {
        console.log('⚠️ Error clearing Firebase reCAPTCHA verifier:', error);
      }
      delete (window as any).recaptchaVerifier;
    }
    
    // Clear the container content
    const container = document.getElementById('recaptcha-container');
    if (container) {
      container.innerHTML = '';
      console.log('✅ reCAPTCHA container cleared');
    }
    
    // Reset Google reCAPTCHA if it exists
    if (typeof (window as any).grecaptcha !== 'undefined' && (window as any).grecaptcha.reset) {
      try {
        (window as any).grecaptcha.reset();
        console.log('✅ Google reCAPTCHA reset');
      } catch (error) {
        console.log('⚠️ Error resetting Google reCAPTCHA:', error);
      }
    }
    
    setRecaptchaInitialized(false);
  };

  const setupRecaptcha = async () => {
    try {
      const isLocalhost = window.location.hostname === 'localhost';
      
      if (isLocalhost && auth.settings.appVerificationDisabledForTesting) {
        console.log('🚫 Skipping reCAPTCHA setup - app verification disabled for testing');
        return null;
      }

      const isProduction = !isLocalhost;
      
      console.log('🔍 Checking reCAPTCHA state...');
      console.log('- recaptchaInitialized:', recaptchaInitialized);
      console.log('- window.recaptchaVerifier exists:', !!(window as any).recaptchaVerifier);
      
      // If reCAPTCHA is already initialized and working, reuse it
      if (recaptchaInitialized && (window as any).recaptchaVerifier) {
        console.log('♻️ Reusing existing reCAPTCHA verifier');
        return (window as any).recaptchaVerifier;
      }
      
      // Clear any existing reCAPTCHA completely
      clearRecaptcha();
      
      // Wait for cleanup to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      // Ensure the container exists and is properly configured
      let recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        // Create container if it doesn't exist
        recaptchaContainer = document.createElement('div');
        recaptchaContainer.id = 'recaptcha-container';
        recaptchaContainer.style.display = isProduction ? 'none' : 'block';
        document.body.appendChild(recaptchaContainer);
        console.log('🔧 Created reCAPTCHA container');
      }
      
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
          setRecaptchaInitialized(false);
          toast({
            title: "Verification Expired",
            description: "Please try again to verify you're human.",
            variant: "destructive",
          });
        },
        'error-callback': (error: any) => {
          console.error('❌ reCAPTCHA error:', error);
          setRecaptchaInitialized(false);
          toast({
            title: "Verification Error",
            description: "reCAPTCHA verification failed. Please refresh and try again.",
            variant: "destructive",
          });
        }
      };

      console.log(`🔒 Creating NEW reCAPTCHA verifier for ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}...`);
      
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', recaptchaConfig);
      (window as any).recaptchaVerifier = verifier;
      
      // Render the reCAPTCHA
      console.log('🎯 Rendering reCAPTCHA...');
      const widgetId = await verifier.render();
      console.log('✅ reCAPTCHA rendered with widget ID:', widgetId);
      
      // Mark as initialized
      setRecaptchaInitialized(true);
      
      // Verify the verifier is properly set up
      if (!verifier) {
        throw new Error('reCAPTCHA verifier failed to initialize');
      }
      
      return verifier;
    } catch (error: any) {
      console.error('❌ reCAPTCHA setup failed:', error);
      
      // If the error is about already rendered, try to clear and retry once
      if (error.message && error.message.includes('already been rendered')) {
        console.log('🔄 reCAPTCHA already rendered, clearing and retrying...');
        clearRecaptcha();
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Don't retry infinitely - just throw the error
        throw new Error('reCAPTCHA already rendered. Please refresh the page and try again.');
      }
      
      // Clean up on error
      clearRecaptcha();
      
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
        const appVerifier = await setupRecaptcha();
        
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
    normalizePhoneNumber,
    clearRecaptcha // Expose cleanup function
  };
};
