import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Award, Users, Calendar } from 'lucide-react';

interface Achievement {
  id: string;
  user_id: string;
  full_name: string;
  achievement_type: string;
  weight_lost: number;
  points_awarded: number;
  achieved_at: string;
}

const AdminWeightAchievements = () => {
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data: achievementsData, error } = await supabase
        .from('weight_achievements')
        .select(`
          *,
          profiles:user_id (
            full_name
          )
        `)
        .order('achieved_at', { ascending: false });

      if (error) throw error;

      const formattedAchievements = achievementsData?.map((achievement: any) => ({
        id: achievement.id,
        user_id: achievement.user_id,
        full_name: achievement.profiles?.full_name || 'Anonymous User',
        achievement_type: achievement.achievement_type,
        weight_lost: parseFloat(achievement.weight_lost),
        points_awarded: achievement.points_awarded,
        achieved_at: achievement.achieved_at
      })) || [];

      setAchievements(formattedAchievements);
    } catch (error: any) {
      console.error('Error fetching achievements:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch achievement data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAchievementInfo = (type: string) => {
    const types: Record<string, { title: string; description: string; color: string }> = {
      'first_kg': {
        title: 'First Kilogram',
        description: 'Lost the first kilogram',
        color: 'bg-blue-100 text-blue-800'
      },
      '5kg_milestone': {
        title: '5kg Milestone',
        description: 'Lost 5 kilograms',
        color: 'bg-green-100 text-green-800'
      },
      '10kg_milestone': {
        title: '10kg Milestone',
        description: 'Lost 10 kilograms',
        color: 'bg-orange-100 text-orange-800'
      },
      '25kg_milestone': {
        title: '25kg Milestone',
        description: 'Lost 25 kilograms',
        color: 'bg-purple-100 text-purple-800'
      },
      '50kg_milestone': {
        title: '50kg Milestone',
        description: 'Lost 50 kilograms',
        color: 'bg-red-100 text-red-800'
      }
    };

    return types[type] || {
      title: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: 'Special achievement',
      color: 'bg-gray-100 text-gray-800'
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading achievements...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-yellow-600" />
            Weight Loss Achievements
          </CardTitle>
          <CardDescription>
            Monitor and manage user achievements and milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement) => {
              const achievementInfo = getAchievementInfo(achievement.achievement_type);
              
              return (
                <div key={achievement.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Award className="h-8 w-8 text-yellow-600" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{achievement.full_name}</h3>
                          <Badge className={achievementInfo.color}>
                            {achievementInfo.title}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {achievementInfo.description} • {achievement.weight_lost.toFixed(1)} kg lost
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <Calendar className="inline h-3 w-3 mr-1" />
                          {new Date(achievement.achieved_at).toLocaleDateString()} at{' '}
                          {new Date(achievement.achieved_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600">
                        +{achievement.points_awarded} pts
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {achievements.length === 0 && (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No achievements yet.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Achievements will appear here as users reach weight loss milestones.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWeightAchievements;
