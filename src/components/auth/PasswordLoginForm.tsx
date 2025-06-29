
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Lock, Eye, EyeOff } from "lucide-react";
import { CountryCodeSelect } from "./CountryCodeSelect";
import { AuthMode } from "@/hooks/useMobileAuth";

interface PasswordLoginFormProps {
  formData: {
    countryCode: string;
    phoneNumber: string;
    password: string;
  };
  showPassword: boolean;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCountryCodeChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onModeChange: (mode: AuthMode) => void;
}

export const PasswordLoginForm = ({
  formData,
  showPassword,
  isLoading,
  onInputChange,
  onCountryCodeChange,
  onTogglePassword,
  onSubmit,
  onModeChange,
}: PasswordLoginFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Phone + Country */}
      <div className="space-y-2">
        <Label htmlFor="signin-phone">Phone Number</Label>
        <div className="flex gap-2">
          <CountryCodeSelect
            value={formData.countryCode}
            onValueChange={onCountryCodeChange}
          />
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="signin-phone"
              name="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={onInputChange}
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="signin-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="signin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={onInputChange}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={isLoading}>
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>

      <div className="pt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => onModeChange("signup")}
          className="text-purple-600 hover:underline font-medium"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};
