
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ClassWithInstances {
  id: string;
  title: string;
  instructor_name: string;
  duration: number;
  class_type: string;
  class_level: string;
  description: string | null;
  timezone: string;
  featured_image_url: string | null;
  image_url: string | null;
  price: number | null;
  recurrence_type: string | null;
  recurrence_days: string[] | null;
  zoom_link: string | null;
  instances: {
    id: string;
    instance_date: string;
    instance_time: string;
    is_cancelled: boolean;
    cancellation_reason: string | null;
  }[];
  tags: {
    id: string;
    name: string;
    color: string;
  }[];
}

export const useClassesWithInstances = () => {
  const [classesWithInstances, setClassesWithInstances] = useState<ClassWithInstances[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClassesWithInstances = async () => {
    try {
      // Get the next 30 days of class instances
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
            price,
            recurrence_type,
            recurrence_days,
            zoom_link
          )
        `)
        .gte('instance_date', new Date().toISOString().split('T')[0])
        .lte('instance_date', endDate.toISOString().split('T')[0])
        .order('instance_date', { ascending: true })
        .order('instance_time', { ascending: true });

      if (error) throw error;

      // Group instances by class and fetch tags
      const classesMap = new Map<string, ClassWithInstances>();
      
      for (const instance of data || []) {
        const classId = instance.classes.id;
        if (!classesMap.has(classId)) {
          // Fetch tags for this class
          const { data: tagsData } = await supabase
            .from('class_tag_assignments')
            .select(`
              class_tags (
                id,
                name,
                color
              )
            `)
            .eq('class_id', classId);

          classesMap.set(classId, {
            ...instance.classes,
            instances: [],
            tags: tagsData?.map(item => item.class_tags).filter(Boolean) || []
          });
        }
        classesMap.get(classId)!.instances.push({
          id: instance.id,
          instance_date: instance.instance_date,
          instance_time: instance.instance_time,
          is_cancelled: instance.is_cancelled,
          cancellation_reason: instance.cancellation_reason
        });
      }

      setClassesWithInstances(Array.from(classesMap.values()));
    } catch (error) {
      console.error('Error fetching classes with instances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassesWithInstances();
  }, []);

  return {
    classesWithInstances,
    isLoading,
    refetch: fetchClassesWithInstances
  };
};
