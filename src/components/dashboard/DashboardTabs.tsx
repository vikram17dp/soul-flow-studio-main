
interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  return (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => onTabChange("classes")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "classes"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Classes
          </button>
       {/* <button
            onClick={() => onTabChange("overview")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Overview
          </button> */}
          <button
            onClick={() => onTabChange("habits")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "habits"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Habits
          </button>
          <button
            onClick={() => onTabChange("points")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "points"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Points
          </button>
          <button
            onClick={() => onTabChange("weight")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "weight"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Weight Tracker
          </button>
        </nav>
      </div>
    </div>
  );
};

export default DashboardTabs;
