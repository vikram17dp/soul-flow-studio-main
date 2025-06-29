
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      condition: "Type 2 Diabetes Reversal",
      result: "HbA1c reduced from 9.2% to 5.8% in 6 months",
      quote: "Swastha's personalized approach helped me reverse my diabetes completely. No more medications, just natural healing!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Anjali Patel",
      condition: "PCOS Management",
      result: "Regular cycles restored, 15kg weight loss",
      quote: "After struggling with PCOS for years, Swastha's holistic program gave me my life back. My cycles are regular and I feel amazing!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Rajesh Kumar",
      condition: "Weight Loss & Thyroid",
      result: "Lost 25kg, thyroid levels normalized",
      quote: "The expert guidance and personalized meal plans made all the difference. I've never felt healthier and more energetic!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-green-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Real Transformations, Real Results
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from our community members who have transformed their health naturally
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white hover:shadow-xl transition-shadow duration-300 animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-green-600 font-medium">{testimonial.condition}</p>
                    <div className="flex mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-100 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-green-800">{testimonial.result}</p>
                </div>
                
                <Quote className="h-6 w-6 text-gray-400 mb-2" />
                <p className="text-gray-600 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
