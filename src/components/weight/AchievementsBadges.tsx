
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Star, Target, Crown } from 'lucide-react';
import { WeightAchievement } from '@/types/weight';
import { format } from 'date-fns';

interface AchievementsBadgesProps {
  achievements: WeightAchievement[];
}

const achievementConfig = {
  first_kg: {
    icon: Star,
    title: 'First Step',
    description: 'Lost your first kilogram!',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  },
  '5kg_milestone': {
    icon: Award,
    title: '5kg Champion',
    description: 'Amazing! You lost 5kg!',
    color: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  '10kg_milestone': {
    icon: Trophy,
    title: '10kg Warrior',
    description: 'Incredible! 10kg down!',
    color: 'bg-green-100 text-green-800 border-green-300'
  },
  '25kg_milestone': {
    icon: Crown,
    title: '25kg Legend',
    description: 'Outstanding! 25kg lost!',
    color: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  '50kg_milestone': {
    icon: Crown,
    title: '50kg Master',
    description: 'Phenomenal! 50kg transformation!',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0'
  }
};

const AchievementsBadges = ({ achievements }: AchievementsBadgesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
          Your Achievements
        </CardTitle>
        <CardDescription>
          Celebrate your weight loss milestones and earned points!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const config = achievementConfig[achievement.achievement_type as keyof typeof achievementConfig];
            if (!config) return null;

            const IconComponent = config.icon;

            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 ${config.color} relative overflow-hidden`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{config.title}</h3>
                    <p className="text-xs opacity-90 mt-1">{config.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="secondary" className="text-xs">
                        +{achievement.points_awarded} points
                      </Badge>
                      <span className="text-xs opacity-75">
                        {format(new Date(achievement.achieved_at), 'MMM dd')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Celebration effect */}
                <div className="absolute top-0 right-0 opacity-20">
                  <IconComponent className="h-16 w-16 transform rotate-12" />
                </div>
              </div>
            );
          })}
        </div>

        {achievements.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Start logging your weight to unlock achievements!</p>
            <p className="text-sm mt-2">
              Milestones: 1kg (+20pts), 5kg (+50pts), 10kg (+100pts), 25kg (+250pts), 50kg (+500pts)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementsBadges;
