
import { Shield, Users, Trophy, Heart } from "lucide-react";

const WhyChooseSection = () => {
  const reasons = [
    {
      icon: Heart,
      title: "Holistic Approach",
      description: "We address the root cause of health issues through integrated mind-body-nutrition care, not just symptoms."
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Certified dietitians, nutritionists, and wellness coaches with years of experience in chronic disease management."
    },
    {
      icon: Trophy,
      title: "Proven Results",
      description: "Evidence-based protocols with documented success in reversing diabetes, PCOS, thyroid issues, and sustainable weight loss."
    },
    {
      icon: Shield,
      title: "Personalized Care",
      description: "Every plan is tailored to your unique health profile, lifestyle, and goals with continuous monitoring and adjustments."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Swastha?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the difference with our comprehensive approach to health transformation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <reason.icon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{reason.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
