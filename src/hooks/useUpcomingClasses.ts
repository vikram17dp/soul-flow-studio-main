
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ClassInstance {
  id: string;
  instance_date: string;
  instance_time: string;
  is_cancelled: boolean;
  cancellation_reason: string | null;
  classes: {
    id: string;
    title: string;
    instructor_name: string;
    duration: number;
    class_type: string;
    class_level: string;
    description: string | null;
    timezone: string;
    image_url: string | null;
    featured_image_url: string | null;
    zoom_link: string | null;
  };
}

export const useUpcomingClasses = () => {
  const [classInstances, setClassInstances] = useState<ClassInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUpcomingClasses = async () => {
    try {
      // Get classes for the next 30 days to ensure we have enough future classes
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      
      const { data, error } = await supabase
        .from('class_instances')
        .select(`
          id,
          instance_date,
          instance_time,
          is_cancelled,
          cancellation_reason,
          classes (
            id,
            title,
            instructor_name,
            duration,
            class_type,
            class_level,
            description,
            timezone,
            image_url,
            featured_image_url,
            zoom_link
          )
        `)
        .gte('instance_date', new Date().toISOString().split('T')[0])
        .lte('instance_date', endDate.toISOString().split('T')[0])
        .order('instance_date', { ascending: true })
        .order('instance_time', { ascending: true });

      if (error) throw error;

      // Return all classes, filtering will be done in the component
      setClassInstances(data || []);
    } catch (error) {
      console.error('Error fetching class instances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingClasses();
  }, []);

  const getClassesForDate = (dateFilter: string) => {
    return classInstances.filter(instance => {
      const instanceDate = new Date(instance.instance_date);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (dateFilter === 'Today') {
        return instanceDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'Tomorrow') {
        return instanceDate.toDateString() === tomorrow.toDateString();
      }
      return false;
    });
  };

  const getActiveClassesForDate = (dateFilter: string) => {
    return getClassesForDate(dateFilter).filter(instance => !instance.is_cancelled);
  };

  const getCancelledClassesForDate = (dateFilter: string) => {
    return getClassesForDate(dateFilter).filter(instance => instance.is_cancelled);
  };

  return {
    classInstances,
    isLoading,
    getClassesForDate,
    getActiveClassesForDate,
    getCancelledClassesForDate,
    refetch: fetchUpcomingClasses
  };
};
