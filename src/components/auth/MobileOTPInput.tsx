
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface MobileOTPInputProps {
  phoneNumber: string;
  onSuccess: (user: any) => void;
  onBack: () => void;
  onResendOTP: (e: React.FormEvent) => Promise<void>;
  confirmationResult: any;
  isLoading?: boolean;
}

export const MobileOTPInput = ({ 
  phoneNumber, 
  onSuccess, 
  onBack, 
  onResendOTP, 
  confirmationResult, 
  isLoading: parentLoading 
}: MobileOTPInputProps) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(90);
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      toast({
        title: "Success!",
        description: "Phone number verified successfully.",
      });
      onSuccess(result.user);
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canResend) return;
    
    setCanResend(false);
    setResendTimer(90);
    setOtp(""); // Clear current OTP
    
    try {
      await onResendOTP(e);
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your phone.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
      setCanResend(true);
      setResendTimer(0);
    }
  };

  const loading = isLoading || parentLoading;

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Verify Your Phone Number</h2>
        <p className="text-sm text-gray-600">
          We've sent a 6-digit code to <strong>{phoneNumber}</strong>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code</Label>
        <Input
          id="otp"
          type="text"
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="text-center text-lg tracking-widest"
          maxLength={6}
          autoComplete="one-time-code"
          disabled={loading}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-purple-600 hover:bg-purple-700"
        disabled={loading || otp.length !== 6}
      >
        {loading ? "Verifying..." : "Verify Code"}
      </Button>

      <div className="text-center space-y-2">
        <div className="text-sm text-gray-600">
          Didn't receive the code?
        </div>
        <button
          type="button"
          onClick={handleResendOTP}
          className={`text-sm font-medium ${
            canResend && !loading
              ? "text-purple-600 hover:text-purple-700 cursor-pointer"
              : "text-gray-400 cursor-not-allowed"
          }`}
          disabled={!canResend || loading}
        >
          {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onBack}
          className="text-purple-600 hover:text-purple-700"
          disabled={loading}
        >
          Back
        </button>
      </div>
    </form>
  );
};
