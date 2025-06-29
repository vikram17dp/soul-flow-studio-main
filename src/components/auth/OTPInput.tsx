
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OTPInputProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
  type: 'signup' | 'signin' | 'recovery';
}

export const OTPInput = ({ email, onSuccess, onBack, type }: OTPInputProps) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

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
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: type === 'signup' ? 'signup' : type === 'signin' ? 'email' : 'recovery',
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: type === 'recovery' ? "Password reset successful." : "Email verified successfully.",
      });
      onSuccess();
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

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      if (type === 'signup') {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email,
        });
        if (error) throw error;
      } else if (type === 'signin') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
        });
        if (error) throw error;
      } else if (type === 'recovery') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
      }

      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {type === 'signup' && "Verify Your Email"}
          {type === 'signin' && "Enter Verification Code"}
          {type === 'recovery' && "Reset Your Password"}
        </h2>
        <p className="text-sm text-gray-600">
          We've sent a 6-digit code to <strong>{email}</strong>
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
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-purple-600 hover:bg-purple-700"
        disabled={isLoading || otp.length !== 6}
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </Button>

      <div className="flex justify-between items-center text-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-purple-600 hover:text-purple-700"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={isResending}
          className="text-purple-600 hover:text-purple-700"
        >
          {isResending ? "Sending..." : "Resend Code"}
        </button>
      </div>
    </form>
  );
};
