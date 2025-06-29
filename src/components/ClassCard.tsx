
import { Button } from "@/components/ui/button";
import { Clock, Users, Star } from "lucide-react";

interface ClassCardProps {
  title: string;
  instructor: string;
  duration: string;
  participants: number;
  rating: number;
  time: string;
  level: string;
  image: string;
  isLive?: boolean;
}

const ClassCard = ({ 
  title, 
  instructor, 
  duration, 
  participants, 
  rating, 
  time, 
  level, 
  image, 
  isLive = false 
}: ClassCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover-scale">
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover"
        />
        {isLive && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            LIVE
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
          {level}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-purple-600 font-medium mb-4">with {instructor}</p>
        
        <div className="flex items-center justify-between text-gray-600 text-sm mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {duration}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {participants} joined
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
            {rating}
          </div>
        </div>
        
        <div className="text-2xl font-bold text-gray-900 mb-4">{time}</div>
        
        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
          {isLive ? "Join Now" : "Book Class"}
        </Button>
      </div>
    </div>
  );
};

export default ClassCard;
