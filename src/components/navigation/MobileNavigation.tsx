
import { Link } from "react-router-dom";
import { Trophy, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import MobileNavigationLink from "./MobileNavigationLink";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavigation = ({ isOpen, onClose }: MobileNavigationProps) => {
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
        {/* Show Home and About only for visitors (non-authenticated users) */}
        {!user && (
          <>
            <MobileNavigationLink to="/" onClick={onClose}>
              Home
            </MobileNavigationLink>
            <MobileNavigationLink to="/about" onClick={onClose}>
              About
            </MobileNavigationLink>
          </>
        )}
        
        {/* Show Dashboard, Classes, and Leaderboard only for authenticated users */}
        {user && (
          <>
            <MobileNavigationLink to="/dashboard" onClick={onClose}>
              Dashboard
            </MobileNavigationLink>
            <MobileNavigationLink to="/classes" onClick={onClose}>
              Classes
            </MobileNavigationLink>
            <MobileNavigationLink to="/leaderboard" onClick={onClose} className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>Leaderboard</span>
            </MobileNavigationLink>
            <MobileNavigationLink to="/my-points" onClick={onClose} className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>My Points</span>
            </MobileNavigationLink>
            <MobileNavigationLink to="/profile" onClick={onClose} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </MobileNavigationLink>
          </>
        )}
        
        <MobileNavigationLink to="/contact" onClick={onClose}>
          Contact
        </MobileNavigationLink>
        
        <MobileNavigationLink to="/pricing" onClick={onClose}>
          Pricing
        </MobileNavigationLink>
        
        {user ? (
          <div className="space-y-1">
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            onClick={onClose}
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileNavigation;
