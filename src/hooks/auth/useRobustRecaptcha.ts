import { useState, useCallback } from 'react';
import { RecaptchaVerifier } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

/**
 * Structured reCAPTCHA manager for OTP with robust lifecycle management.
 */
export const useRobustRecaptcha = () => {
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);

  /**
   * Comprehensive cleanup of reCAPTCHA state
   */
  const fullCleanup = useCallback(() => {
    console.log('🧹 Executing full reCAPTCHA cleanup...');

    // Clear Firebase verifier
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
        console.log('✅ Firebase verifier cleared');
      } catch (error) {
        console.error('Error clearing Firebase verifier:', error);
      }
      delete window.recaptchaVerifier;
    }

    // Reset Google reCAPTCHA
    if (window.grecaptcha?.reset) {
      try {
        window.grecaptcha.reset();
        console.log('✅ Google reCAPTCHA reset');
      } catch (error) {
        console.error('Error resetting Google reCAPTCHA:', error);
      }
    }

    // Clear DOM container
    const container = document.getElementById('recaptcha-container');
    if (container) {
      container.innerHTML = '';
      console.log('✅ DOM container cleared');
    }

    setInitialized(false);
  }, []);

  /**
   * Initialize or reuse existing reCAPTCHA
   */
  const initOrReuseRecaptcha = useCallback(async () => {
    if (initialized && window.recaptchaVerifier) {
      console.log('♻️ Reusing existing reCAPTCHA verifier');
      return window.recaptchaVerifier;
    }

    console.log('🔧 Setting up new reCAPTCHA verifier...');
    fullCleanup();

    // Wait for cleanup to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Ensure container exists and is ready
    const container = document.getElementById('recaptcha-container') || document.body.appendChild(document.createElement('div'));
    if (!container.id) {
      container.id = 'recaptcha-container';
      container.style.display = window.location.hostname === 'localhost' ? 'block' : 'none';
    }

    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: window.location.hostname === 'localhost' ? 'normal' : 'invisible',
      callback: (response: string) => {
        console.log('✅ reCAPTCHA solved, response length:', response?.length);
        if (!response) console.error('❌ reCAPTCHA response is empty');
      },
      'expired-callback': () => {
        console.warn('⚠️ reCAPTCHA expired');
        setInitialized(false);
        toast({
          title: 'Verification Expired',
          description: 'Please try the verification again.',
          variant: 'destructive',
        });
      },
      'error-callback': (error: any) => {
        console.error('❌ reCAPTCHA error:', error);
        setInitialized(false);
        toast({
          title: 'Verification Error',
          description: 'Please refresh and try the verification again.',
          variant: 'destructive',
        });
      },
    });

    await verifier.render();
    window.recaptchaVerifier = verifier;
    setInitialized(true);
    return verifier;
  }, [initialized, fullCleanup, toast]);

  /**
   * Reset and prepare for new attempt
   */
  const resetForRetry = useCallback(async () => {
    console.log('🔄 Resetting reCAPTCHA for retry...');
    fullCleanup();
    return await initOrReuseRecaptcha();
  }, [fullCleanup, initOrReuseRecaptcha]);

  return { initOrReuseRecaptcha, resetForRetry };
};
