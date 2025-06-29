import { Button } from "@/components/ui/button";
import { Play, Calendar } from "lucide-react";

// Legacy hero section - keeping for backward compatibility
// New home page uses /src/components/home/HeroSection.tsx
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-purple-600 to-pink-600">
              Health, Naturally
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Holistic health platform specializing in weight loss and reversing chronic diseases. 
            Expert dietitians, personalized plans, and proven results.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-full hover-scale"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Start Your Health Journey
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-full hover-scale"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Success Stories
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">1000+</div>
              <div className="text-gray-600">Lives Transformed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">5+</div>
              <div className="text-gray-600">Chronic Conditions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">24/7</div>
              <div className="text-gray-600">Health Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
