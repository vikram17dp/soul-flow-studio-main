
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Subscription {
  id: string;
  status: string;
  starts_at: string;
  expires_at: string;
  credits_remaining: number;
  packages: {
    name: string;
    class_credits: number;
  };
}

const MembershipSection = () => {
  const { profile, user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSubscriptions = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      console.log('Fetching subscriptions for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          packages (
            name,
            class_credits
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching subscriptions:', error);
        setError('Failed to load subscription data');
        return;
      }

      console.log('Subscriptions data:', data);
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setError('Failed to load subscription data');
      toast({
        title: 'Error',
        description: 'Failed to load subscription data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'unlimited':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMembershipIcon = (type: string) => {
    return type === 'basic' ? null : <Crown className="h-4 w-4" />;
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Not Logged In</h4>
          <p className="text-gray-600">Please log in to view your membership details.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h4>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchSubscriptions} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Membership */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white rounded-full shadow-sm">
            {getMembershipIcon(profile?.membership_type || 'basic') || (
              <CreditCard className="h-6 w-6 text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
            <Badge className={getMembershipColor(profile?.membership_type || 'basic')}>
              {(profile?.membership_type || 'basic').toUpperCase()}
            </Badge>
          </div>
        </div>
        <Link to="/pricing">
          <Button variant="outline">
            Upgrade Plan
          </Button>
        </Link>
      </div>

      {/* Active Subscriptions */}
      {subscriptions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Active Subscriptions</h4>
          {subscriptions.map((subscription) => (
            <Card key={subscription.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {subscription.packages?.name || 'Package'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Expires</p>
                      <p className="text-sm text-gray-600">
                        {new Date(subscription.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Credits Remaining</p>
                      <p className="text-sm text-gray-600">
                        {subscription.credits_remaining || 0}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Badge 
                      variant={subscription.status === 'active' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {subscription.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Active Subscriptions */}
      {subscriptions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {profile?.membership_type === 'basic' ? 'No Active Subscriptions' : 'Welcome to Your Membership'}
            </h4>
            <p className="text-gray-600 mb-4">
              {profile?.membership_type === 'basic' 
                ? 'Upgrade to a premium plan to access exclusive classes and features.'
                : 'Enjoy your premium membership benefits and exclusive access to classes.'
              }
            </p>
            {profile?.membership_type === 'basic' && (
              <Link to="/pricing">
                <Button>Browse Plans</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MembershipSection;
