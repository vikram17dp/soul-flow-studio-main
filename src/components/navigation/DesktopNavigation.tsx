
import { Trophy, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NavigationLink from "./NavigationLink";
import AuthSection from "./AuthSection";

const DesktopNavigation = () => {
  const { user } = useAuth();

  return (
    <div className="hidden md:flex items-center space-x-8">
      {/* Show Home and About only for visitors (non-authenticated users) */}
      {!user && (
        <>
          <NavigationLink to="/">Home</NavigationLink>
          <NavigationLink to="/about">About</NavigationLink>
        </>
      )}
      
      {/* Show Dashboard, Classes, and Leaderboard only for authenticated users */}
      {user && (
        <>
          <NavigationLink to="/dashboard">Dashboard</NavigationLink>
          <NavigationLink to="/classes">Classes</NavigationLink>
          <NavigationLink to="/leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </NavigationLink>
          <NavigationLink to="/my-points" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            My Points
          </NavigationLink>
          <NavigationLink to="/profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </NavigationLink>
        </>
      )}
      
      <NavigationLink to="/contact">Contact</NavigationLink>
      <NavigationLink to="/pricing">Pricing</NavigationLink>
      
      <AuthSection />
    </div>
  );
};

export default DesktopNavigation;
