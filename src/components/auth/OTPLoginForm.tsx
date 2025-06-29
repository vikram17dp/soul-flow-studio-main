
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";
import { CountryCodeSelect } from "./CountryCodeSelect";
import { AuthMode } from "@/hooks/useMobileAuth";

interface OTPLoginFormProps {
  formData: {
    countryCode: string;
    phoneNumber: string;
  };
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCountryCodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onModeChange: (mode: AuthMode) => void;
}

export const OTPLoginForm = ({
  formData,
  isLoading,
  onInputChange,
  onCountryCodeChange,
  onSubmit,
  onModeChange,
}: OTPLoginFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Phone for OTP */}
      <div className="space-y-2">
        <Label htmlFor="signin-phone-otp">Phone Number</Label>
        <div className="flex gap-2">
          <CountryCodeSelect
            value={formData.countryCode}
            onValueChange={onCountryCodeChange}
          />
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="signin-phone-otp"
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

      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={isLoading}>
        {isLoading ? "Sending OTP..." : "Send OTP"}
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
