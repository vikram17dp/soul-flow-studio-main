
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Settings } from "lucide-react";

const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Book New Class
        </Button>
        <Button variant="outline" className="w-full" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Browse Instructors
        </Button>
        <Button variant="outline" className="w-full" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Account Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
