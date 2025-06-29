
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClassInstance {
  id: string;
  class_id: string;
  instance_date: string;
  instance_time: string;
  is_cancelled: boolean;
  cancelled_at: string | null;
  cancelled_by: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
  classes: {
    title: string;
    instructor_name: string;
    duration: number;
    zoom_link: string | null;
  };
}

export const useClassInstanceManagement = (classId: string) => {
  const [instances, setInstances] = useState<ClassInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInstances();
  }, [classId]);

  const fetchInstances = async () => {
    try {
      console.log('Fetching instances for class ID:', classId);
      
      const { data, error } = await supabase
        .from('class_instances')
        .select(`
          *,
          classes (title, instructor_name, duration, zoom_link)
        `)
        .eq('class_id', classId)
        .order('instance_date', { ascending: true });

      if (error) {
        console.error('Error fetching instances:', error);
        throw error;
      }
      
      console.log('Fetched instances:', data);
      setInstances(data || []);
    } catch (error) {
      console.error('Error fetching instances:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch class instances',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMoreInstances = async () => {
    try {
      const { data, error } = await supabase.rpc('generate_class_instances', {
        p_class_id: classId
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Generated ${data} additional class instances`,
      });

      fetchInstances();
    } catch (error) {
      console.error('Error generating instances:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate class instances',
        variant: 'destructive'
      });
    }
  };

  const cancelInstance = async (instanceId: string, cancellationReason: string) => {
    try {
      const { error } = await supabase
        .from('class_instances')
        .update({
          is_cancelled: true,
          cancelled_at: new Date().toISOString(),
          cancellation_reason: cancellationReason
        })
        .eq('id', instanceId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Class instance cancelled successfully',
      });

      fetchInstances();
    } catch (error) {
      console.error('Error cancelling instance:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel class instance',
        variant: 'destructive'
      });
    }
  };

  const uncancelInstance = async (instanceId: string) => {
    try {
      const { error } = await supabase
        .from('class_instances')
        .update({
          is_cancelled: false,
          cancelled_at: null,
          cancellation_reason: null
        })
        .eq('id', instanceId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Class instance restored successfully',
      });

      fetchInstances();
    } catch (error) {
      console.error('Error restoring instance:', error);
      toast({
        title: 'Error',
        description: 'Failed to restore class instance',
        variant: 'destructive'
      });
    }
  };

  return {
    instances,
    isLoading,
    fetchInstances,
    generateMoreInstances,
    cancelInstance,
    uncancelInstance
  };
};
