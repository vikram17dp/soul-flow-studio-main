
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { YogaClass } from '../forms/ClassFormTypes';

export const useClassManagement = () => {
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<YogaClass[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    const filtered = classes.filter(yogaClass => 
      yogaClass.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      yogaClass.instructor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      yogaClass.class_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClasses(filtered);
  }, [classes, searchTerm]);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData = (data || []).map(item => ({
        ...item,
        class_level: item.class_level as YogaClass['class_level']
      })) as YogaClass[];
      
      setClasses(typedData);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch classes',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleClassStatus = async (classId: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('classes')
        .update({ is_active: !currentStatus })
        .eq('id', classId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Class ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });

      fetchClasses();
    } catch (error) {
      console.error('Error updating class status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update class status',
        variant: 'destructive'
      });
    }
  };

  const deleteClass = async (classId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Class "${title}" deleted successfully`,
      });

      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete class',
        variant: 'destructive'
      });
    }
  };

  const generateInstances = async (classId: string) => {
    try {
      const { data, error } = await supabase.rpc('generate_class_instances', {
        p_class_id: classId
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Generated ${data} class instances`,
      });
    } catch (error) {
      console.error('Error generating instances:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate class instances',
        variant: 'destructive'
      });
    }
  };

  return {
    classes,
    filteredClasses,
    searchTerm,
    setSearchTerm,
    isLoading,
    fetchClasses,
    toggleClassStatus,
    deleteClass,
    generateInstances
  };
};
