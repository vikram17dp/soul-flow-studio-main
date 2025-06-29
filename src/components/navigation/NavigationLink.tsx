
import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface NavigationLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavigationLink = ({ to, children, className = "", onClick }: NavigationLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeClasses = isActive 
    ? "text-purple-600 bg-purple-50" 
    : "text-gray-700 hover:text-purple-600 hover:bg-purple-50";

  return (
    <Link
      to={to}
      className={`${baseClasses} ${activeClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavigationLink;
