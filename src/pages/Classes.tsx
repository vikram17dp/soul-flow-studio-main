
import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import { useClassesWithInstances } from "@/hooks/useClassesWithInstances";
import { ClassesHero } from "@/components/classes/ClassesHero";
import { ClassesFilters } from "@/components/classes/ClassesFilters";
import { ClassesGrid } from "@/components/classes/ClassesGrid";
import { ClassesLoadingState } from "@/components/classes/ClassesLoadingState";

const Classes = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const { classesWithInstances, isLoading } = useClassesWithInstances();

  const filteredClasses = useMemo(() => {
    const now = new Date();
    
    return classesWithInstances.filter(classItem => {
      // First, filter out classes with no future instances
      const futureInstances = classItem.instances.filter(instance => {
        if (instance.is_cancelled) return false;
        const instanceDateTime = new Date(`${instance.instance_date}T${instance.instance_time}`);
        return instanceDateTime > now;
      });
      
      if (futureInstances.length === 0) return false;
      
      // Filter by level
      const matchesLevel = activeFilter === "All" || classItem.class_level === activeFilter;
      
      // Filter by search term
      const matchesSearch = classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           classItem.instructor_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by date
      let matchesDate = true;
      if (dateFilter !== "all") {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const hasInstanceInRange = futureInstances.some(instance => {
          const instanceDate = new Date(instance.instance_date);
          const instanceDay = new Date(instanceDate.getFullYear(), instanceDate.getMonth(), instanceDate.getDate());
          
          switch (dateFilter) {
            case "today":
              return instanceDay.getTime() === today.getTime();
            case "tomorrow":
              return instanceDay.getTime() === tomorrow.getTime();
            case "week":
              return instanceDay >= today && instanceDay <= weekFromNow;
            default:
              return true;
          }
        });
        
        matchesDate = hasInstanceInRange;
      }
      
      return matchesLevel && matchesSearch && matchesDate;
    });
  }, [classesWithInstances, activeFilter, searchTerm, dateFilter]);

  if (isLoading) {
    return <ClassesLoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <ClassesHero />
      <ClassesFilters
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />
      <ClassesGrid filteredClasses={filteredClasses} />
    </div>
  );
};

export default Classes;
