
import { useToast } from '@/hooks/use-toast';
import { AuthFormData, AuthMode, LoginMethod } from './types';

export const useAuthValidation = () => {
  const { toast } = useToast();

  const validateForm = (formData: AuthFormData, authMode: AuthMode, loginMethod: LoginMethod) => {
    if (!formData.phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Phone number is required",
        variant: "destructive",
      });
      return false;
    }

    if (authMode === 'signup' && !formData.name.trim()) {
      toast({
        title: "Error",
        description: "Full name is required for signup",
        variant: "destructive",
      });
      return false;
    }

    if (loginMethod === 'password' && !formData.password.trim()) {
      toast({
        title: "Error",
        description: "Password is required",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return { validateForm };
};
