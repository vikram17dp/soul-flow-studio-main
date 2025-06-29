
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-green-600 via-purple-600 to-pink-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Transform Your Health?
        </h2>
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
          Join thousands who have reversed chronic diseases and achieved lasting wellness with Swastha's 
          holistic approach. Your transformation starts today.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/auth">
            <Button 
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full hover-scale"
            >
              <Heart className="mr-2 h-5 w-5" />
              Start Your Transformation
            </Button>
          </Link>
          
          <Link to="/contact">
            <Button 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold rounded-full hover-scale"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Free Consultation
            </Button>
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center space-x-8 text-white">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            <span className="text-sm">Join 1000+ happy members</span>
          </div>
          <div className="text-sm">
            ⭐⭐⭐⭐⭐ 4.9/5 rating
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
