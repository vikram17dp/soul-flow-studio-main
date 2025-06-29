
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Trophy } from "lucide-react";

const RecentAchievement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="h-5 w-5 mr-2 text-yellow-500" />
          Recent Achievement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900">Week Warrior!</h3>
          <p className="text-sm text-gray-600 mt-1">
            You've completed 7 days in a row. Keep it up!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAchievement;
