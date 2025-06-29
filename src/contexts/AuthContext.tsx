
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { AuthContextType } from '@/types/auth';
import { useAuthData } from '@/hooks/useAuthData';
import { useAuthOperations } from '@/hooks/useAuthOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  
  // Prevent multiple initializations
  const initializingRef = useRef(false);
  const mountedRef = useRef(true);

  const {
    profile,
    isAdmin,
    fetchUserProfile,
    checkAdminStatus,
    clearUserData
  } = useAuthData();

  const { login, register, logout } = useAuthOperations(setIsLoading);

  // Memoize data fetching to prevent unnecessary calls
  const fetchUserData = useCallback(async (userId: string) => {
    if (!mountedRef.current) return;
    
    try {
      await Promise.all([
        fetchUserProfile(userId),
        checkAdminStatus(userId)
      ]);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [fetchUserProfile, checkAdminStatus]);

  useEffect(() => {
    mountedRef.current = true;
    
    const initializeAuth = async () => {
      if (initializingRef.current || initialized) return;
      
      try {
        initializingRef.current = true;
        console.log('Initializing auth...');
        
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mountedRef.current) return;
            
            console.log('Auth state changed:', event, session?.user?.email);
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              // Fetch user data after a short delay to prevent race conditions
              setTimeout(() => {
                if (mountedRef.current) {
                  fetchUserData(session.user.id);
                }
              }, 100);
            } else {
              clearUserData();
            }
            
            // Set loading to false after processing auth state
            if (initialized) {
              setIsLoading(false);
            }
          }
        );
        
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        }
        
        if (mountedRef.current) {
          console.log('Initial session:', initialSession?.user?.email);
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            setTimeout(() => {
              if (mountedRef.current) {
                fetchUserData(initialSession.user.id);
              }
            }, 100);
          }
          
          setInitialized(true);
          setIsLoading(false);
        }
        
        // Return cleanup function
        return () => {
          subscription.unsubscribe();
        };
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mountedRef.current) {
          setInitialized(true);
          setIsLoading(false);
        }
      } finally {
        initializingRef.current = false;
      }
    };

    let cleanup: (() => void) | undefined;
    
    if (!initialized) {
      initializeAuth().then((cleanupFn) => {
        cleanup = cleanupFn;
      });
    }

    return () => {
      mountedRef.current = false;
      if (cleanup) {
        cleanup();
      }
    };
  }, [initialized, fetchUserData, clearUserData]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session, 
      isAdmin,
      login, 
      register, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
