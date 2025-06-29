
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { YogaClass, ClassFormData } from './forms/ClassFormTypes';
import { ClassFormFields } from './forms/ClassFormFields';
import { RecurrenceSettings } from './forms/RecurrenceSettings';

interface EditClassFormProps {
  yogaClass: YogaClass;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditClassForm = ({ yogaClass, onSuccess, onCancel }: EditClassFormProps) => {
  const [formData, setFormData] = useState<ClassFormData>({
    title: yogaClass.title,
    description: yogaClass.description || '',
    instructor_name: yogaClass.instructor_name,
    instructor_id: yogaClass.instructor_id || '',
    class_type: yogaClass.class_type,
    class_level: yogaClass.class_level || 'Beginner',
    duration: yogaClass.duration,
    price: yogaClass.price || 0,
    schedule_time: yogaClass.schedule_time || '',
    recurrence_type: (yogaClass.recurrence_type || 'none') as any,
    recurrence_days: (yogaClass.recurrence_days || []) as any,
    timezone: yogaClass.timezone || 'Asia/Kolkata',
    is_active: yogaClass.is_active ?? true,
    featured_image_url: yogaClass.featured_image_url || '',
    zoom_link: yogaClass.zoom_link || '',
    selected_tags: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchClassTags();
  }, [yogaClass.id]);

  const fetchClassTags = async () => {
    try {
      const { data, error } = await supabase
        .from('class_tag_assignments')
        .select('tag_id')
        .eq('class_id', yogaClass.id);

      if (error) throw error;
      
      setFormData(prev => ({
        ...prev,
        selected_tags: data?.map(item => item.tag_id) || []
      }));
    } catch (error) {
      console.error('Error fetching class tags:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Submitting class update with data:', formData);
      
      // Prepare the update data
      const updateData = {
        title: formData.title,
        description: formData.description || null,
        instructor_name: formData.instructor_name,
        instructor_id: formData.instructor_id || null,
        class_type: formData.class_type,
        class_level: formData.class_level,
        duration: formData.duration,
        price: formData.price,
        schedule_time: formData.schedule_time || null,
        recurrence_type: formData.recurrence_type === 'none' ? null : formData.recurrence_type,
        recurrence_days: formData.recurrence_days.length > 0 ? formData.recurrence_days : null,
        timezone: formData.timezone,
        is_active: formData.is_active,
        featured_image_url: formData.featured_image_url || null,
        zoom_link: formData.zoom_link || null,
        updated_at: new Date().toISOString()
      };

      console.log('Update data prepared:', updateData);

      // Update class
      const { error: classError } = await supabase
        .from('classes')
        .update(updateData)
        .eq('id', yogaClass.id);

      if (classError) {
        console.error('Class update error:', classError);
        throw classError;
      }

      console.log('Class updated successfully');

      // Update class tags
      // First delete existing tags
      const { error: deleteTagsError } = await supabase
        .from('class_tag_assignments')
        .delete()
        .eq('class_id', yogaClass.id);

      if (deleteTagsError) {
        console.error('Error deleting existing tags:', deleteTagsError);
        throw deleteTagsError;
      }

      // Then insert new tags
      if (formData.selected_tags.length > 0) {
        const tagAssignments = formData.selected_tags.map(tagId => ({
          class_id: yogaClass.id,
          tag_id: tagId
        }));

        console.log('Inserting tag assignments:', tagAssignments);

        const { error: tagsError } = await supabase
          .from('class_tag_assignments')
          .insert(tagAssignments);

        if (tagsError) {
          console.error('Error inserting tags:', tagsError);
          throw tagsError;
        }
      }

      console.log('All updates completed successfully');

      toast({
        title: 'Success',
        description: 'Class updated successfully',
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating class:', error);
      toast({
        title: 'Error',
        description: 'Failed to update class. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>Edit Class: {yogaClass.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ClassFormFields formData={formData} setFormData={setFormData} />
          
          <RecurrenceSettings formData={formData} setFormData={setFormData} />

          <div className="flex space-x-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">
              {isSubmitting ? 'Updating...' : 'Update Class'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditClassForm;
