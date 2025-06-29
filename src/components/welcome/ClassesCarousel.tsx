
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import JoinClassButton from '@/components/JoinClassButton';

interface ClassInstance {
  id: string;
  instance_date: string;
  instance_time: string;
  is_cancelled: boolean;
  classes: {
    id: string;
    title: string;
    instructor_name: string;
    class_level: string;
    featured_image_url?: string;
    zoom_link?: string;
  };
}

interface ClassesCarouselProps {
  upcomingClasses: ClassInstance[];
}

const ClassesCarousel = ({ upcomingClasses }: ClassesCarouselProps) => {
  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Filter classes to show only future classes from current time
  const now = new Date();
  const futureClasses = upcomingClasses.filter(classInstance => {
    const classDateTime = new Date(`${classInstance.instance_date}T${classInstance.instance_time}`);
    return classDateTime > now;
  }).slice(0, 9); // Take only 9 future classes

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Upcoming Classes
          </span>
          <Link to="/classes">
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
              See All Classes
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {futureClasses.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {futureClasses.map((classInstance) => (
                <CarouselItem key={classInstance.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full">
                    <div className="relative">
                      <div 
                        className="h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-t-lg flex items-center justify-center"
                        style={{
                          backgroundImage: classInstance.classes.featured_image_url 
                            ? `url(${classInstance.classes.featured_image_url})` 
                            : undefined,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        {!classInstance.classes.featured_image_url && (
                          <Users className="h-12 w-12 text-white opacity-80" />
                        )}
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-blue-500 text-white text-xs">
                          {classInstance.classes.class_level}
                        </Badge>
                      </div>
                      {classInstance.is_cancelled && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg flex items-center justify-center">
                          <Badge variant="destructive">Cancelled</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                        {classInstance.classes.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-3">
                        by {classInstance.classes.instructor_name}
                      </p>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(classInstance.instance_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(classInstance.instance_time)}</span>
                        </div>
                      </div>
                      
                      {classInstance.is_cancelled ? (
                        <button 
                          disabled
                          className="w-full mt-3 px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed"
                        >
                          Cancelled
                        </button>
                      ) : (
                        <JoinClassButton
                          classId={classInstance.classes.id}
                          instanceId={classInstance.id}
                          instanceDate={classInstance.instance_date}
                          instanceTime={classInstance.instance_time}
                          zoomLink={classInstance.classes.zoom_link || null}
                          className="w-full mt-3 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        />
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No upcoming classes available</p>
            <Link to="/classes">
              <button className="mt-4 px-6 py-2 font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                Browse All Classes
              </button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassesCarousel;
