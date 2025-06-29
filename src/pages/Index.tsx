
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import HealthAssessmentSection from "@/components/home/HealthAssessmentSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <HealthAssessmentSection />
      <CTASection />
    </div>
  );
};

export default Index;
