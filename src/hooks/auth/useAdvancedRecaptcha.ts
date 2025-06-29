import { useState, useCallback } from 'react';
import { RecaptchaVerifier } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

/**
 * Advanced reCAPTCHA management hook that handles:
 * - Single instance per DOM element
 * - Proper cleanup and reuse
 * - Error handling for "already rendered" scenarios
 * - State tracking
 */
export const useAdvancedRecaptcha = () => {
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  /**
   * Check if reCAPTCHA is already rendered
   */
  const getRecaptchaState = useCallback(() => {
    const hasVerifier = !!(window as any).recaptchaVerifier;
    const hasContainer = !!document.getElementById('recaptcha-container');
    const containerHasChildren = hasContainer && 
      document.getElementById('recaptcha-container')!.children.length > 0;
    
    return {
      hasVerifier,
      hasContainer,
      isRendered: containerHasChildren,
      canReuse: hasVerifier && isInitialized && containerHasChildren
    };
  }, [isInitialized]);

  /**
   * Complete reCAPTCHA cleanup - clears everything
   */
  const completeCleanup = useCallback(() => {
    console.log('🧹 Starting complete reCAPTCHA cleanup...');
    
    // 1. Clear Firebase reCAPTCHA verifier
    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
        console.log('✅ Firebase reCAPTCHA verifier cleared');
      } catch (error) {
        console.log('⚠️ Error clearing Firebase verifier:', error);
      }
      delete (window as any).recaptchaVerifier;
    }
    
    // 2. Reset Google reCAPTCHA widget
    if (typeof (window as any).grecaptcha !== 'undefined' && (window as any).grecaptcha.reset) {
      try {
        (window as any).grecaptcha.reset();
        console.log('✅ Google reCAPTCHA widget reset');
      } catch (error) {
        console.log('⚠️ Error resetting Google reCAPTCHA:', error);
      }
    }
    
    // 3. Clear container content
    const container = document.getElementById('recaptcha-container');
    if (container) {
      container.innerHTML = '';
      console.log('✅ reCAPTCHA container cleared');
    }
    
    // 4. Reset state
    setIsInitialized(false);
    setIsRendering(false);
    
    console.log('✅ Complete reCAPTCHA cleanup finished');
  }, []);

  /**
   * Ensure container exists with proper configuration
   */
  const ensureContainer = useCallback(() => {
    let container = document.getElementById('recaptcha-container');
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'recaptcha-container';
      
      const isProduction = window.location.hostname !== 'localhost';
      container.style.display = isProduction ? 'none' : 'block';
      
      document.body.appendChild(container);
      console.log('🔧 reCAPTCHA container created');
    }
    
    return container;
  }, []);

  /**
   * Get existing verifier or create new one
   */
  const getOrCreateVerifier = useCallback(async () => {
    const state = getRecaptchaState();
    
    console.log('🔍 reCAPTCHA State Check:', {
      hasVerifier: state.hasVerifier,
      isInitialized,
      canReuse: state.canReuse,
      isRendering
    });

    // If currently rendering, wait for it to complete
    if (isRendering) {
      console.log('⏳ reCAPTCHA is currently rendering, waiting...');
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (!isRendering) {
            clearInterval(checkInterval);
            resolve(undefined);
          }
        }, 100);
      });
    }

    // Reuse existing verifier if possible
    if (state.canReuse) {
      console.log('♻️ Reusing existing reCAPTCHA verifier');
      return (window as any).recaptchaVerifier;
    }

    try {
      setIsRendering(true);
      
      // Clear any existing state
      completeCleanup();
      
      // Wait for cleanup to complete
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Ensure container exists
      ensureContainer();
      
      // Wait for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 100));

      const isProduction = window.location.hostname !== 'localhost';
      
      // Create reCAPTCHA configuration
      const recaptchaConfig = {
        size: isProduction ? 'invisible' : 'normal',
        callback: (response: string) => {
          console.log('✅ reCAPTCHA solved successfully');
          console.log('Token length:', response ? response.length : 'No token');
          
          if (!response) {
            console.error('❌ reCAPTCHA callback received empty response!');
            toast({
              title: "Verification Error",
              description: "reCAPTCHA verification incomplete. Please try again.",
              variant: "destructive",
            });
          }
        },
        'expired-callback': () => {
          console.warn('⚠️ reCAPTCHA expired');
          setIsInitialized(false);
          toast({
            title: "Verification Expired",
            description: "Please verify you're human again.",
            variant: "destructive",
          });
        },
        'error-callback': (error: any) => {
          console.error('❌ reCAPTCHA error:', error);
          setIsInitialized(false);
          toast({
            title: "Verification Error",
            description: "reCAPTCHA verification failed. Please refresh and try again.",
            variant: "destructive",
          });
        }
      };

      console.log(`🔒 Creating NEW reCAPTCHA verifier for ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}...`);
      
      // Create new verifier
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', recaptchaConfig);
      
      // Render the verifier
      console.log('🎯 Rendering reCAPTCHA...');
      const widgetId = await verifier.render();
      console.log('✅ reCAPTCHA rendered successfully with widget ID:', widgetId);
      
      // Store globally and update state
      (window as any).recaptchaVerifier = verifier;
      setIsInitialized(true);
      
      return verifier;
      
    } catch (error: any) {
      console.error('❌ reCAPTCHA setup failed:', error);
      
      // Handle specific "already rendered" error
      if (error.message && error.message.includes('already been rendered')) {
        console.log('🔄 Detected "already rendered" error, clearing and retrying...');
        completeCleanup();
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Don't retry infinitely - throw error for user action
        throw new Error('reCAPTCHA is in an inconsistent state. Please refresh the page and try again.');
      }
      
      // Clean up on any error
      completeCleanup();
      
      throw new Error(`Failed to initialize phone verification: ${error.message}`);
      
    } finally {
      setIsRendering(false);
    }
  }, [isInitialized, isRendering, getRecaptchaState, completeCleanup, ensureContainer, toast]);

  /**
   * Check if reCAPTCHA is ready for use
   */
  const isReady = useCallback(() => {
    const state = getRecaptchaState();
    return state.canReuse && !isRendering;
  }, [getRecaptchaState, isRendering]);

  /**
   * Force refresh - completely reset and recreate
   */
  const forceRefresh = useCallback(async () => {
    console.log('🔄 Force refreshing reCAPTCHA...');
    completeCleanup();
    return await getOrCreateVerifier();
  }, [completeCleanup, getOrCreateVerifier]);

  return {
    getOrCreateVerifier,
    completeCleanup,
    isReady,
    isInitialized,
    isRendering,
    forceRefresh,
    getRecaptchaState
  };
};
