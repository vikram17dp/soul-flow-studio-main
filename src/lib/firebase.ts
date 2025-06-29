
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDVMWdEn3QkdQ_c1cXpAkoS257D8Wz5-NM",
  authDomain: "shuddha-32217.firebaseapp.com", 
  projectId: "shuddha-32217",
  storageBucket: "shuddha-32217.firebasestorage.app",
  messagingSenderId: "809995789251",
  appId: "1:809995789251:web:18520da28b9d0a2f999376"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Configure Firebase Auth settings for development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Option 1: Connect to Firebase Auth Emulator (recommended for testing)
  const useEmulator = true; // Set to false to use real Firebase
  
  if (useEmulator) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      console.log('🔧 Firebase Auth Emulator connected - no domain restrictions!');
      console.log('Start emulator with: firebase emulators:start --only auth');
    } catch (error) {
      console.log('Firebase Auth Emulator not running, falling back to production mode');
      // Disable app verification for localhost testing as fallback
      auth.settings.appVerificationDisabledForTesting = true;
      console.log('Firebase Auth configured for localhost development - app verification disabled');
    }
  } else {
    // Disable app verification for localhost testing
    auth.settings.appVerificationDisabledForTesting = true;
    console.log('Firebase Auth configured for localhost development - app verification disabled');
  }
} else {
  auth.settings.appVerificationDisabledForTesting = false;
  console.log('Firebase Auth configured for production - app verification enabled');
}

// Development configuration
if (typeof window !== 'undefined') {
  // Log current domain for Firebase configuration
  console.log('Current domain for Firebase:', window.location.hostname);
  if (window.location.hostname === 'localhost') {
    console.log('🚀 LOCALHOST TESTING OPTIONS:');
    console.log('1. Use Firebase Auth Emulator (recommended): firebase emulators:start --only auth');
    console.log('2. Add test phone numbers in Firebase Console');
    console.log('3. Request domain whitelist access from Firebase admin');
  } else {
    console.log('Make sure this domain is added to Firebase Console → Authentication → Settings → Authorized domains');
  }
}

export default app;
