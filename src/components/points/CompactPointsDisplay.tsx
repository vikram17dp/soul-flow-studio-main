
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useUserPoints } from '@/hooks/points/useUserPoints';

const CompactPointsDisplay = memo(() => {
  const { userPoints, isLoading } = useUserPoints();

  // Show a stable placeholder while loading to prevent flashing
  const totalPoints = userPoints?.total_points ?? 0;

  if (isLoading && !userPoints) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold text-gray-900">
              Points: --
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link to="/my-points">
      <Card className="bg-white/70 backdrop-blur-sm border-purple-200 hover:bg-white/80 transition-colors cursor-pointer">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold text-gray-900">
              Points: {totalPoints.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

CompactPointsDisplay.displayName = 'CompactPointsDisplay';

export default CompactPointsDisplay;
