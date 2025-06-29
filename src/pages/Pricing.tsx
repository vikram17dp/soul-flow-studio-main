
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import RazorpayPayment from '@/components/RazorpayPayment';

interface Package {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  duration_months: number;
  class_credits: number | null;
  features: string[] | null;
  is_active: boolean | null;
  is_popular: boolean | null;
  currency: string | null;
  category: string | null;
}

const Pricing = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedDuration, setSelectedDuration] = useState('3');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pricing packages',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.duration_months.toString() === selectedDuration
  );

  const uniqueDurations = [...new Set(packages.map(pkg => pkg.duration_months))]
    .sort((a, b) => a - b);

  const formatPrice = (price: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const handleSelectPlan = (pkg: Package) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to purchase a subscription plan.',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }

    setSelectedPackage(pkg);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: 'Welcome!',
      description: 'Your subscription is now active. Enjoy your yoga journey!',
    });
    // Refresh the page or redirect to dashboard
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the right membership plan for your yoga journey. Secure payments with Razorpay.
          </p>
        </div>

        <Tabs value={selectedDuration} onValueChange={setSelectedDuration} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {uniqueDurations.map(duration => (
              <TabsTrigger key={duration} value={duration.toString()}>
                {duration} {duration === 1 ? 'Month' : 'Months'}
              </TabsTrigger>
            ))}
          </TabsList>

          {uniqueDurations.map(duration => (
            <TabsContent key={duration} value={duration.toString()}>
              <div className="grid md:grid-cols-3 gap-8">
                {filteredPackages.map((pkg) => (
                  <Card 
                    key={pkg.id} 
                    className={`relative ${pkg.is_popular ? 'border-purple-500 border-2 shadow-lg' : ''}`}
                  >
                    {pkg.is_popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-purple-600 text-white px-4 py-1 flex items-center space-x-1">
                          <Star className="h-4 w-4" />
                          <span>Most Popular</span>
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {pkg.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {pkg.description}
                      </CardDescription>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-4xl font-bold text-purple-600">
                            {formatPrice(pkg.price, pkg.currency || 'INR')}
                          </span>
                          {pkg.original_price && pkg.original_price > pkg.price && (
                            <span className="text-lg text-gray-500 line-through">
                              {formatPrice(pkg.original_price, pkg.currency || 'INR')}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">
                          for {pkg.duration_months} {pkg.duration_months === 1 ? 'month' : 'months'}
                        </p>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-2 text-lg">
                          <span className="font-semibold text-purple-600">
                            {pkg.class_credits ? `${pkg.class_credits} Credits` : 'Unlimited Classes'}
                          </span>
                        </div>
                        
                        {pkg.features && pkg.features.length > 0 && (
                          <ul className="space-y-2">
                            {pkg.features.map((feature, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        
                        <Button 
                          className={`w-full mt-6 ${
                            pkg.is_popular 
                              ? 'bg-purple-600 hover:bg-purple-700' 
                              : 'bg-gray-900 hover:bg-gray-800'
                          }`}
                          onClick={() => handleSelectPlan(pkg)}
                        >
                          Choose {pkg.name}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No packages available for {selectedDuration} {selectedDuration === '1' ? 'month' : 'months'}.
            </p>
          </div>
        )}
      </div>

      <RazorpayPayment
        selectedPackage={selectedPackage}
        onClose={() => setSelectedPackage(null)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Pricing;
