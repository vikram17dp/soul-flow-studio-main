
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { MobileOTPInput } from "./MobileOTPInput";
import { LoginMethodToggle } from "./LoginMethodToggle";
import { PasswordLoginForm } from "./PasswordLoginForm";
import { OTPLoginForm } from "./OTPLoginForm";
import { SignupForm } from "./SignupForm";
import { useMobileAuth } from "@/hooks/useMobileAuth";
import { useEffect } from "react";

export const MobileAuth = () => {
  const {
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
    handlePasswordLogin,
    handleSendOTP,
    handleOTPSuccess,
    handleInputChange,
  } = useMobileAuth();

  // Ensure reCAPTCHA container exists
  useEffect(() => {
    const ensureRecaptchaContainer = () => {
      if (!document.getElementById('recaptcha-container')) {
        const container = document.createElement('div');
        container.id = 'recaptcha-container';
        
        // Show reCAPTCHA on localhost for debugging, hide in production
        const isLocalhost = window.location.hostname === 'localhost';
        if (isLocalhost) {
          container.style.display = 'block';
          container.style.margin = '10px auto';
          container.style.textAlign = 'center';
          console.log('reCAPTCHA container visible for localhost debugging');
        } else {
          container.style.display = 'none';
        }
        
        document.body.appendChild(container);
      }
    };

    ensureRecaptchaContainer();
    
    // Cleanup on unmount
    return () => {
      const container = document.getElementById('recaptcha-container');
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  const handleCountryCodeChange = (value: string) => {
    setFormData({ ...formData, countryCode: value });
  };

  if (authMode === 'otp') {
    return (
      <>
        {/* reCAPTCHA container - must be present for OTP to work */}
        <div id="recaptcha-container" style={{ display: 'none' }}></div>
        <MobileOTPInput
          phoneNumber={formData.countryCode + formData.phoneNumber}
          onSuccess={handleOTPSuccess}
          onBack={() => {
            setAuthMode('signin');
            setConfirmationResult(null);
          }}
          onResendOTP={handleSendOTP}
          confirmationResult={confirmationResult}
          isLoading={isLoading}
        />
      </>
    );
  }

  return (
    <>
      {/* reCAPTCHA container - must be present for OTP to work */}
      <div id="recaptcha-container" style={{ display: 'none' }}></div>
      <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as any)} className="w-full">
        {/* SIGN IN FORM */}
        <TabsContent value="signin" className="space-y-4 mt-6">
          <LoginMethodToggle
            loginMethod={loginMethod}
            onMethodChange={setLoginMethod}
          />

          {loginMethod === 'password' ? (
            <PasswordLoginForm
              formData={formData}
              showPassword={showPassword}
              isLoading={isLoading}
              onInputChange={handleInputChange}
              onCountryCodeChange={handleCountryCodeChange}
              onTogglePassword={() => setShowPassword(!showPassword)}
              onSubmit={handlePasswordLogin}
              onModeChange={setAuthMode}
            />
          ) : (
            <OTPLoginForm
              formData={formData}
              isLoading={isLoading}
              onInputChange={handleInputChange}
              onCountryCodeChange={handleCountryCodeChange}
              onSubmit={handleSendOTP}
              onModeChange={setAuthMode}
            />
          )}
        </TabsContent>

        {/* SIGN UP FORM */}
        <TabsContent value="signup" className="space-y-4 mt-6">
          <SignupForm
            formData={formData}
            showPassword={showPassword}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onCountryCodeChange={handleCountryCodeChange}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={handleSendOTP}
            onModeChange={setAuthMode}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};
