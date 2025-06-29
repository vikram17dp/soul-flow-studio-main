
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PointRule, PointActivityType } from '@/types/points';

interface UserPointsWithProfile {
  id: string;
  user_id: string;
  total_points: number;
  lifetime_earned: number;
  lifetime_redeemed: number;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

export const usePointsAdmin = () => {
  const { toast } = useToast();
  const [allUserPoints, setAllUserPoints] = useState<UserPointsWithProfile[]>([]);
  const [pointRules, setPointRules] = useState<PointRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllUserPoints();
    fetchPointRules();
  }, []);

  const fetchAllUserPoints = async () => {
    try {
      // First get all user points
      const { data: userPointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('*')
        .order('total_points', { ascending: false });

      if (pointsError) throw pointsError;

      // Then get profiles for each user
      const userIds = userPointsData?.map(up => up.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const combinedData = userPointsData?.map((userPoint, index) => {
        const profile = profilesData?.find(p => p.id === userPoint.user_id);
        return {
          ...userPoint,
          profiles: {
            full_name: profile?.full_name || 'Unknown User',
            email: profile?.full_name 
              ? `${profile.full_name.toLowerCase().replace(/\s+/g, '.')}@example.com`
              : `user${index + 1}@example.com`
          }
        };
      }) || [];

      setAllUserPoints(combinedData);
    } catch (error: any) {
      console.error('Error fetching all user points:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user points data',
        variant: 'destructive'
      });
    }
  };

  const fetchPointRules = async () => {
    try {
      const { data, error } = await supabase
        .from('point_rules')
        .select('*')
        .order('activity_type');

      if (error) throw error;

      setPointRules(data || []);
    } catch (error: any) {
      console.error('Error fetching point rules:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch point rules',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePointRule = async (ruleId: string, updates: Partial<PointRule>) => {
    try {
      const { error } = await supabase
        .from('point_rules')
        .update(updates)
        .eq('id', ruleId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Point rule updated successfully'
      });

      fetchPointRules();
    } catch (error: any) {
      console.error('Error updating point rule:', error);
      toast({
        title: 'Error',
        description: 'Failed to update point rule',
        variant: 'destructive'
      });
    }
  };

  const awardPoints = async (
    userId: string,
    activityType: PointActivityType,
    customPoints?: number,
    description?: string
  ) => {
    try {
      const { error } = await supabase.rpc('award_points', {
        _user_id: userId,
        _activity_type: activityType,
        _custom_points: customPoints,
        _description: description
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Points awarded successfully'
      });

      fetchAllUserPoints();
    } catch (error: any) {
      console.error('Error awarding points:', error);
      toast({
        title: 'Error',
        description: 'Failed to award points',
        variant: 'destructive'
      });
    }
  };

  return {
    allUserPoints,
    pointRules,
    isLoading,
    updatePointRule,
    awardPoints,
    refetch: () => {
      fetchAllUserPoints();
      fetchPointRules();
    }
  };
};
