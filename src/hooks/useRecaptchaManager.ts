import { useEffect, useRef, useCallback } from 'react';
import { RecaptchaVerifier } from 'firebase/auth';

const useRecaptchaManager = (auth) => {
  const recaptchaVerifier = useRef(null);
  const containerId = 'recaptcha-container';

  const clearRecaptcha = useCallback(() => {
    console.log('Clearing reCAPTCHA...');
    if (recaptchaVerifier.current) {
      try {
        recaptchaVerifier.current.clear();
        console.log('Firebase reCAPTCHA verifier cleared');
      } catch (error) {
        console.error('Error clearing reCAPTCHA:', error);
      }
      recaptchaVerifier.current = null;
    }

    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
      console.log('reCAPTCHA container cleared');
    }
  }, []);

  const setupRecaptcha = useCallback(async () => {
    const isLocalhost = window.location.hostname === 'localhost';

    if (isLocalhost && auth.settings.appVerificationDisabledForTesting) {
      console.log('Skipping reCAPTCHA setup on localhost');
      return null;
    }

    clearRecaptcha();

    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    }

    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: isLocalhost ? 'normal' : 'invisible',
      callback: (response) => {
        console.log('reCAPTCHA solved:', response);
      },
      'expired-callback': () => {
        console.warn('reCAPTCHA has expired, resetting...');
        clearRecaptcha();
      },
      'error-callback': (error) => {
        console.error('reCAPTCHA error:', error);
        clearRecaptcha();
      },
    });

    await verifier.render();
    recaptchaVerifier.current = verifier;
  }, [auth, clearRecaptcha]);

  useEffect(() => {
    return () => {
      clearRecaptcha();
    };
  }, [clearRecaptcha]);

  return {
    setupRecaptcha,
    resetRecaptcha: clearRecaptcha,
  };
};

export default useRecaptchaManager;

