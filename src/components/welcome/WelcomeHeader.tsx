
import React from 'react';
import { Star } from 'lucide-react';

interface WelcomeHeaderProps {
  userName: string;
}

const WelcomeHeader = ({ userName }: WelcomeHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
        Welcome back, {userName}! 🌟
      </h1>
      <p className="text-gray-600">Your wellness journey at a glance</p>
    </div>
  );
};

export default WelcomeHeader;
