
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  membershipType: string;
  onLogout: () => void;
}

const DashboardHeader = ({ userName, membershipType, onLogout }: DashboardHeaderProps) => {
  const getMembershipBadgeColor = (type: string) => {
    switch (type) {
      case "basic":
        return "bg-gray-100 text-gray-800";
      case "premium":
        return "bg-purple-100 text-purple-800";
      case "unlimited":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600 mt-1">Ready for your next session?</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className={getMembershipBadgeColor(membershipType)}>
            {membershipType.charAt(0).toUpperCase() + membershipType.slice(1)} Member
          </Badge>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
