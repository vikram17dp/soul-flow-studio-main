
import React from 'react';
import Navigation from '@/components/Navigation';
import UserPointsSection from '@/components/points/UserPointsSection';

const MyPoints = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <UserPointsSection />
      </div>
    </div>
  );
};

export default MyPoints;
