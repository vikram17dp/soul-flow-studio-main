import { useEffect, useRef, useCallback, useState } from 'react';
import { RecaptchaVerifier, Auth } from 'firebase/auth';

interface RecaptchaManagerOptions {
  size?: 'normal' | 'compact' | 'invisible';
  theme?: 'light' | 'dark';
  containerId?: string;
  onSuccess?: (response: string) => void;
  onExpired?: () => void;
  onError?: (error: any) => void;
}

const useRecaptchaManager = (auth: Auth, options: RecaptchaManagerOptions = {}) => {
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  
  const containerId = options.containerId || 'recaptcha-container';
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const isProduction = !isLocalhost;

  // Clear all reCAPTCHA state and DOM elements
  const clearRecaptcha = useCallback(() => {
    console.log('🧹 Clearing reCAPTCHA state...');
    
    // Clear local ref
    if (recaptchaVerifier.current) {
      try {
        recaptchaVerifier.current.clear();
        console.log('✅ Local reCAPTCHA verifier cleared');
      } catch (error) {
        console.warn('⚠️ Error clearing local reCAPTCHA:', error);
      }
      recaptchaVerifier.current = null;
    }

    // Clear global window verifier
    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
        console.log('✅ Global reCAPTCHA verifier cleared');
      } catch (error) {
        console.warn('⚠️ Error clearing global reCAPTCHA:', error);
      }
      delete (window as any).recaptchaVerifier;
    }

    // Reset Google reCAPTCHA widget
    if (typeof (window as any).grecaptcha !== 'undefined' && (window as any).grecaptcha.reset) {
      try {
        (window as any).grecaptcha.reset();
        console.log('✅ Google reCAPTCHA widget reset');
      } catch (error) {
        console.warn('⚠️ Error resetting Google reCAPTCHA:', error);
      }
    }

    // Clear DOM container
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
      container.removeAttribute('data-sitekey');
      container.removeAttribute('data-size');
      container.removeAttribute('data-theme');
      console.log('✅ reCAPTCHA container cleared');
    }

    setIsInitialized(false);
    setIsRendering(false);
  }, [containerId]);

  // Ensure container exists with proper styling
  const ensureContainer = useCallback(() => {
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      
      // Style container based on environment
      if (isProduction) {
        container.style.display = 'none';
      } else {
        container.style.display = 'block';
        container.style.margin = '10px auto';
        container.style.textAlign = 'center';
      }
      
      document.body.appendChild(container);
      console.log(`📦 Created reCAPTCHA container for ${isProduction ? 'production' : 'development'}`);
    }
    return container;
  }, [containerId, isProduction]);

  // Setup reCAPTCHA with comprehensive error handling
  const setupRecaptcha = useCallback(async (): Promise<RecaptchaVerifier | null> => {
    try {
      console.log(`🔐 Setting up reCAPTCHA for ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}...`);
      
      // Skip reCAPTCHA setup for localhost with app verification disabled
      if (isLocalhost && auth.settings.appVerificationDisabledForTesting) {
        console.log('🚫 Skipping reCAPTCHA setup - app verification disabled for testing');
        return null;
      }

      // Check if already rendering
      if (isRendering) {
        console.log('⏳ reCAPTCHA already rendering, waiting...');
        // Wait for current render to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (recaptchaVerifier.current) {
          return recaptchaVerifier.current;
        }
      }

      // Check if already initialized and working
      if (isInitialized && recaptchaVerifier.current) {
        console.log('♻️ Reusing existing reCAPTCHA verifier');
        return recaptchaVerifier.current;
      }

      setIsRendering(true);
      
      // Clear any existing state
      clearRecaptcha();
      
      // Small delay to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 200));

      // Ensure container exists
      ensureContainer();
      
      // Wait for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create verifier configuration
      const recaptchaConfig = {
        size: options.size || (isProduction ? 'invisible' : 'normal'),
        theme: options.theme || 'light',
        callback: (response: string) => {
          console.log('✅ reCAPTCHA solved successfully');
          console.log('📄 Response token length:', response?.length || 0);
          if (options.onSuccess) {
            options.onSuccess(response);
          }
          if (!response) {
            console.error('❌ Empty reCAPTCHA response received!');
          }
        },
        'expired-callback': () => {
          console.warn('⚠️ reCAPTCHA expired');
          setIsInitialized(false);
          if (options.onExpired) {
            options.onExpired();
          }
        },
        'error-callback': (error: any) => {
          console.error('❌ reCAPTCHA error:', error);
          setIsInitialized(false);
          setIsRendering(false);
          if (options.onError) {
            options.onError(error);
          }
        }
      };

      console.log('🔧 Creating new reCAPTCHA verifier...');
      const verifier = new RecaptchaVerifier(auth, containerId, recaptchaConfig);
      
      console.log('🎯 Rendering reCAPTCHA...');
      const widgetId = await verifier.render();
      console.log('✅ reCAPTCHA rendered with widget ID:', widgetId);
      
      // Store references
      recaptchaVerifier.current = verifier;
      (window as any).recaptchaVerifier = verifier;
      
      setIsInitialized(true);
      setIsRendering(false);
      
      return verifier;
    } catch (error: any) {
      console.error('❌ reCAPTCHA setup failed:', error);
      setIsRendering(false);
      setIsInitialized(false);
      
      if (error.message?.includes('already been rendered')) {
        console.log('🔄 Detected "already rendered" error, clearing and retrying...');
        clearRecaptcha();
        throw new Error('reCAPTCHA already rendered. Page refresh may be required.');
      }
      
      throw error;
    }
  }, [auth, containerId, isLocalhost, isProduction, isRendering, isInitialized, clearRecaptcha, ensureContainer, options]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      console.log('🧹 useRecaptchaManager cleanup on unmount');
      clearRecaptcha();
    };
  }, [clearRecaptcha]);

  return {
    setupRecaptcha,
    resetRecaptcha: clearRecaptcha,
    isInitialized,
    isRendering,
    verifier: recaptchaVerifier.current
  };
};

export default useRecaptchaManager;

