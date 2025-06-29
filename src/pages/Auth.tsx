
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { MobileAuth } from "@/components/auth/MobileAuth";

const Auth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">Soul Flow Studio</span>
          </div>
          <p className="text-gray-600">Your journey to inner peace begins here</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome
            </CardTitle>
            <CardDescription>
              Sign in or create your account with your mobile number
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <MobileAuth />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
