
import { Link } from "react-router-dom";

const NavigationLogo = () => {
  return (
    <div className="flex items-center">
      <Link to="/" className="flex-shrink-0 flex items-center">
        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
          Swastha
        </span>
        <span className="ml-2 text-sm text-gray-600 hidden sm:block">Transform Naturally</span>
      </Link>
    </div>
  );
};

export default NavigationLogo;
