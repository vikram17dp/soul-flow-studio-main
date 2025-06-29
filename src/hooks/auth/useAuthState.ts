
import { useState } from 'react';
import { AuthMode, LoginMethod, AuthFormData, AuthState } from './types';

export const useAuthState = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    countryCode: '+91',
    phoneNumber: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    handleInputChange,
  };
};
