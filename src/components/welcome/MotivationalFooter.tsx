
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const MotivationalFooter = () => {
  return (
    <Card className="bg-gradient-to-r from-purple-100 to-pink-100">
      <CardContent className="p-6 text-center">
        <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-purple-800 mb-2">Keep Going! You're Amazing! 🌟</h3>
        <p className="text-purple-700 text-sm">
          Every step counts on your wellness journey. Stay consistent and celebrate your progress!
        </p>
      </CardContent>
    </Card>
  );
};

export default MotivationalFooter;
