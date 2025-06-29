
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, Heart, Users, Apple, Brain, Activity, Calendar, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  const services = [
    {
      icon: Scale,
      title: "Smart Weight Management",
      description: "AI-powered weight tracking with personalized meal plans and expert guidance for sustainable weight loss.",
      features: ["Real-time progress tracking", "Custom meal plans", "Expert dietitian support"],
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Heart,
      title: "Chronic Disease Reversal",
      description: "Evidence-based protocols for reversing diabetes, PCOS, thyroid, and other metabolic conditions.",
      features: ["Diabetes management", "PCOS support", "Thyroid optimization"],
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      icon: Users,
      title: "Live Yoga & Fitness",
      description: "Interactive online classes with certified instructors for physical and mental wellness.",
      features: ["Live yoga sessions", "Meditation classes", "Fitness programs"],
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: Apple,
      title: "Personalized Nutrition",
      description: "Custom diet plans tailored to your health condition, preferences, and lifestyle needs.",
      features: ["Condition-specific diets", "Meal planning", "Nutritional analysis"],
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      icon: MessageCircle,
      title: "Expert Counselling",
      description: "One-on-one sessions with certified dietitians and health coaches for personalized guidance.",
      features: ["1-on-1 consultations", "Progress monitoring", "Lifestyle coaching"],
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Activity,
      title: "Habit Tracking",
      description: "Build lasting healthy habits with our smart tracking system and behavioral insights.",
      features: ["Daily habit tracking", "Progress analytics", "Motivation rewards"],
      color: "text-pink-600",
      bgColor: "bg-pink-100"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Complete Health Transformation Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From weight management to chronic disease reversal, we provide comprehensive, 
            evidence-based solutions for your health journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
              <CardHeader>
                <div className={`w-16 h-16 ${service.bgColor} rounded-full flex items-center justify-center mb-4`}>
                  <service.icon className={`h-8 w-8 ${service.color}`} />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className={`w-2 h-2 ${service.bgColor} rounded-full mr-3`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/auth">
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
