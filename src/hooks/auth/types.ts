
export type AuthMode = 'signin' | 'signup' | 'otp';
export type LoginMethod = 'password' | 'otp';

export interface AuthFormData {
  name: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
}

export interface AuthState {
  authMode: AuthMode;
  loginMethod: LoginMethod;
  showPassword: boolean;
  isLoading: boolean;
  formData: AuthFormData;
}
