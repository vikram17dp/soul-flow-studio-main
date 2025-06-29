
import { useAuthState } from './auth/useAuthState';
import { useAuthValidation } from './auth/useAuthValidation';
import { usePasswordAuth } from './auth/usePasswordAuth';
import { useOTPAuth } from './auth/useOTPAuth';
import { AuthMode, LoginMethod } from './auth/types';

export type { AuthMode, LoginMethod };

export const useMobileAuth = () => {
  const {
    authMode,
    setAuthMode,
    loginMethod,
    setLoginMethod,
    showPassword,
    setShowPassword,
    formData,
    setFormData,
    handleInputChange,
  } = useAuthState();

  const { validateForm } = useAuthValidation();
  const { handlePasswordLogin, isLoading: passwordLoading } = usePasswordAuth();
  const { 
    handleSendOTP, 
    handleOTPSuccess, 
    confirmationResult, 
    setConfirmationResult,
    isLoading: otpLoading 
  } = useOTPAuth();

  const isLoading = passwordLoading || otpLoading;

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    if (!validateForm(formData, authMode, loginMethod)) return;
    await handlePasswordLogin(e, formData, authMode, setAuthMode);
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    if (!validateForm(formData, authMode, loginMethod)) return;
    await handleSendOTP(e, formData, setAuthMode);
  };

  const handleOTPVerification = async (firebaseUser: any) => {
    await handleOTPSuccess(firebaseUser, formData, authMode);
  };

  return {
    authMode,
    setAuthMode,
    loginMethod,
    setLoginMethod,
    showPassword,
    setShowPassword,
    formData,
    setFormData,
    confirmationResult,
    setConfirmationResult,
    isLoading,
    handlePasswordLogin: handlePasswordSubmit,
    handleSendOTP: handleOTPSubmit,
    handleOTPSuccess: handleOTPVerification,
    handleInputChange,
  };
};
