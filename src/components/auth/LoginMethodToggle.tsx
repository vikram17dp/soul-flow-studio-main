
import { LoginMethod } from "@/hooks/useMobileAuth";

interface LoginMethodToggleProps {
  loginMethod: LoginMethod;
  onMethodChange: (method: LoginMethod) => void;
}

export const LoginMethodToggle = ({ loginMethod, onMethodChange }: LoginMethodToggleProps) => {
  return (
    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
      <button
        type="button"
        onClick={() => onMethodChange('password')}
        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
          loginMethod === 'password' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Password
      </button>
      <button
        type="button"
        onClick={() => onMethodChange('otp')}
        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
          loginMethod === 'otp' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        OTP
      </button>
    </div>
  );
};
