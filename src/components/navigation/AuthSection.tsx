
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const AuthSection = () => {
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
  };

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="border-purple-200 text-purple-600 hover:bg-purple-50"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Link to="/auth">
      <Button 
        size="sm"
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        Sign In
      </Button>
    </Link>
  );
};

export default AuthSection;
