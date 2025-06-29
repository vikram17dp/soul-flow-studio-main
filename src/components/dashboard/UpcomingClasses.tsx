
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface ClassItem {
  id: number;
  title: string;
  instructor: string;
  time: string;
  date: string;
  duration: string;
  type: string;
}

interface UpcomingClassesProps {
  classes: ClassItem[];
}

const UpcomingClasses = ({ classes }: UpcomingClassesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-purple-600" />
          Upcoming Classes
        </CardTitle>
        <CardDescription>Your scheduled yoga sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {classes.map((class_) => (
            <div
              key={class_.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{class_.title}</h3>
                <p className="text-sm text-gray-600">with {class_.instructor}</p>
                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {class_.date}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {class_.time}
                  </span>
                  <Badge variant="outline">{class_.type}</Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{class_.duration}</p>
                <Button size="sm" className="mt-2 bg-purple-600 hover:bg-purple-700">
                  Join Class
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingClasses;
