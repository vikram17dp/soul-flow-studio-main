
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Heart, Users, Award, Clock } from "lucide-react";

const About = () => {
  const instructors = [
    {
      name: "Sarah Chen",
      specialty: "Vinyasa Flow & Meditation",
      experience: "8 years",
      image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Sarah brings mindfulness and grace to every practice, helping students find their inner strength."
    },
    {
      name: "Michael Torres",
      specialty: "Power Yoga & Strength",
      experience: "12 years",
      image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Michael combines traditional yoga with modern fitness principles for a transformative experience."
    },
    {
      name: "Emma Williams",
      specialty: "Restorative & Yin Yoga",
      experience: "10 years",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Emma specializes in gentle practices that promote healing and deep relaxation."
    }
  ];

  const stats = [
    { icon: Users, value: "500+", label: "Happy Students" },
    { icon: Clock, value: "10K+", label: "Classes Taught" },
    { icon: Award, value: "15+", label: "Expert Instructors" },
    { icon: Heart, value: "98%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Soul Flow Studio
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Founded with a vision to make yoga accessible to everyone, everywhere. 
              We believe in the transformative power of yoga to heal, strengthen, and inspire.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Soul Flow Studio was born from a simple belief: yoga should be accessible to everyone, 
                regardless of location, schedule, or experience level. What started as a small local 
                studio has grown into a global community of practitioners united by their journey 
                toward wellness and inner peace.
              </p>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Our expert instructors bring decades of combined experience, offering authentic 
                teachings rooted in traditional yoga philosophy while embracing modern approaches 
                to health and wellness. Every class is designed to meet you exactly where you are 
                in your practice.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Join Our Community
              </Button>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <img 
                src="https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Yoga practice"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Numbers that reflect our commitment to spreading wellness and mindfulness worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Instructors
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from certified yoga teachers with years of experience and specialized training
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                <img 
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{instructor.name}</h3>
                  <p className="text-purple-600 font-medium mb-2">{instructor.specialty}</p>
                  <p className="text-gray-500 text-sm mb-4">{instructor.experience} of experience</p>
                  <p className="text-gray-600">{instructor.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of students who have transformed their lives through yoga
          </p>
          <Button 
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full hover-scale"
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
