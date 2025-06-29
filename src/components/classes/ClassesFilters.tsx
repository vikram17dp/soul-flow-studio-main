
import { Button } from "@/components/ui/button";
import { Calendar, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface ClassesFiltersProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
}

const levelFilters = ["All", "Beginner", "Intermediate", "Advanced"];
const dateFilters = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "week", label: "This Week" },
  { value: "all", label: "All Upcoming" }
];

export const ClassesFilters = ({
  activeFilter,
  setActiveFilter,
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter
}: ClassesFiltersProps) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <section className="py-4 bg-white border-b border-gray-100 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </div>
            <span className="text-sm text-gray-500">
              {dateFilter !== "all" ? dateFilters.find(f => f.value === dateFilter)?.label : "All"} • {activeFilter}
            </span>
          </Button>
        </div>

        {/* Desktop Filters - Always Visible */}
        <div className="hidden md:flex items-center gap-4">
          {/* Date Filter Pills */}
          <div className="flex items-center gap-2">
            {dateFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={dateFilter === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setDateFilter(filter.value)}
                className={`${
                  dateFilter === filter.value 
                    ? "bg-gray-900 hover:bg-gray-800" 
                    : "hover:bg-gray-50"
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <div className="flex-1 flex items-center justify-end gap-4">
            {/* Search */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search classes or instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200"
              />
            </div>

            {/* Level Filters */}
            <div className="flex items-center gap-2">
              {levelFilters.map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={activeFilter === filter ? "bg-gray-900 hover:bg-gray-800" : ""}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Filters - Collapsible */}
        {showMobileFilters && (
          <div className="md:hidden space-y-4 pt-4 border-t border-gray-100">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="grid grid-cols-2 gap-2">
                {dateFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={dateFilter === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter(filter.value)}
                    className={`${
                      dateFilter === filter.value 
                        ? "bg-gray-900 hover:bg-gray-800" 
                        : ""
                    }`}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <div className="grid grid-cols-2 gap-2">
                {levelFilters.map((filter) => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(filter)}
                    className={activeFilter === filter ? "bg-gray-900 hover:bg-gray-800" : ""}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
