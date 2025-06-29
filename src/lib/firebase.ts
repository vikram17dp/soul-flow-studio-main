
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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

// Configure Firebase Auth settings
if (typeof window !== 'undefined') {
  // Only disable app verification for localhost development
  if (window.location.hostname === 'localhost') {
    auth.settings.appVerificationDisabledForTesting = true;
    console.log('🔧 Firebase Auth: App verification disabled for localhost development');
  } else {
    auth.settings.appVerificationDisabledForTesting = false;
    console.log('🚀 Firebase Auth: Production mode - app verification enabled');
  }
  
  // Log current domain for debugging
  console.log('Current domain:', window.location.hostname);
}

export default app;
