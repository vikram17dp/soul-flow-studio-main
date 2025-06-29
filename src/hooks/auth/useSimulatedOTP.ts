import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthFormData, AuthMode } from './types';

interface SimulatedConfirmationResult {
  confirm: (code: string) => Promise<{ user: { uid: string; phoneNumber: string } }>;
}

// Test phone numbers with their corresponding OTP codes
const TEST_PHONE_NUMBERS = {
  '+911234567890': '123456',
  '+15551234567': '654321',
  '+447911123456': '999888',
  '+33123456789': '111222',
};

export const useSimulatedOTP = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<SimulatedConfirmationResult | null>(null);

  const normalizePhoneNumber = (countryCode: string, phoneNumber: string) => {
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const cleanCountryCode = countryCode.startsWith('+') ? countryCode : '+' + countryCode;
    return cleanCountryCode + cleanPhone;
  };

  const sendOTP = async (formData: AuthFormData, setAuthMode: (mode: AuthMode) => void) => {
    try {
      setIsLoading(true);
      console.log('🎭 Starting SIMULATED OTP send process...');
      
      const phoneNumber = normalizePhoneNumber(formData.countryCode, formData.phoneNumber);
      console.log('Normalized phone number:', phoneNumber);

      if (!phoneNumber || phoneNumber.length < 10) {
        throw new Error('Please enter a valid phone number');
      }

      // Check if it's a test phone number
      if (!(phoneNumber in TEST_PHONE_NUMBERS)) {
        throw new Error(`Phone number ${phoneNumber} is not in test numbers. Available test numbers: ${Object.keys(TEST_PHONE_NUMBERS).join(', ')}`);
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create simulated confirmation result
      const mockConfirmationResult: SimulatedConfirmationResult = {
        confirm: async (code: string) => {
          const expectedCode = TEST_PHONE_NUMBERS[phoneNumber as keyof typeof TEST_PHONE_NUMBERS];
          
          if (code !== expectedCode) {
            throw new Error('Invalid OTP code');
          }

          // Simulate successful verification
          return {
            user: {
              uid: `simulated_${Date.now()}`,
              phoneNumber: phoneNumber
            }
          };
        }
      };

      setConfirmationResult(mockConfirmationResult);
      setAuthMode('otp');
      
      const expectedOTP = TEST_PHONE_NUMBERS[phoneNumber as keyof typeof TEST_PHONE_NUMBERS];
      
      toast({
        title: "🎭 Simulated OTP sent!",
        description: `Use OTP: ${expectedOTP} for ${phoneNumber}`,
      });

      console.log(`🎭 SIMULATED OTP: ${expectedOTP} for ${phoneNumber}`);
      
    } catch (error: any) {
      console.error('Simulated OTP send error:', error);
      
      toast({
        title: "Simulation Error",
        description: error.message || "Failed to send simulated OTP",
        variant: "destructive",
      });
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
    testPhoneNumbers: TEST_PHONE_NUMBERS
  };
};
