
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AuthFormData, AuthMode } from './types';

export const usePasswordAuth = () => {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordLogin = async (
    e: React.FormEvent,
    formData: AuthFormData,
    authMode: AuthMode,
    setAuthMode: (mode: AuthMode) => void
  ) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Create email format from phone number for authentication
      const email = `${formData.countryCode}${formData.phoneNumber}@phone.local`;
      
      if (authMode === 'signup') {
        console.log('Registering user with:', { 
          name: formData.name, 
          email, 
          phone: formData.countryCode + formData.phoneNumber 
        });
        
        if (!formData.name || formData.name.trim() === '') {
          throw new Error('Please enter your full name');
        }
        
        if (!formData.password || formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
        
        await register(formData.name.trim(), email, formData.password);
        
        toast({
          title: "Account created successfully!",
          description: "Redirecting to dashboard...",
        });
        
      } else {
        console.log('Attempting login with email:', email);
        
        if (!formData.password) {
          throw new Error('Please enter your password');
        }
        
        await login(email, formData.password);
        
        toast({
          title: "Welcome back!",
          description: "Redirecting to dashboard...",
        });
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.message?.includes('Invalid login credentials')) {
        if (authMode === 'signin') {
          errorMessage = "Invalid phone number or password. Please check your credentials or try signing up.";
        } else {
          errorMessage = "Unable to create account. Please try with different credentials.";
        }
      } else if (error.message?.includes('User already registered')) {
        errorMessage = "This phone number is already registered. Please try signing in instead.";
        setAuthMode('signin');
      } else if (error.message?.includes('Password should be at least 6 characters')) {
        errorMessage = "Password must be at least 6 characters long.";
      } else if (error.message?.includes('Signup requires a valid password')) {
        errorMessage = "Please enter a valid password (at least 6 characters).";
      } else if (error.message?.includes('full name')) {
        errorMessage = "Please enter your full name.";
      } else if (error.message?.includes('Password must be at least')) {
        errorMessage = error.message;
      } else if (error.message?.includes('Please enter')) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handlePasswordLogin, isLoading };
};
