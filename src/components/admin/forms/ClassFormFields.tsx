import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ClassFormData, Instructor, ClassTag } from './ClassFormTypes';
import { classTypes, classLevels, timezones } from './ClassFormConstants';
import { supabase } from '@/integrations/supabase/client';

interface ClassFormFieldsProps {
  formData: ClassFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClassFormData>>;
}

export const ClassFormFields = ({ formData, setFormData }: ClassFormFieldsProps) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [classTags, setClassTags] = useState<ClassTag[]>([]);

  useEffect(() => {
    fetchInstructors();
    fetchClassTags();
  }, []);

  const fetchInstructors = async () => {
    try {
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setInstructors(data || []);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const fetchClassTags = async () => {
    try {
      const { data, error } = await supabase
        .from('class_tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setClassTags(data || []);
    } catch (error) {
      console.error('Error fetching class tags:', error);
    }
  };

  const handleInstructorChange = (instructorId: string) => {
    const instructor = instructors.find(i => i.id === instructorId);
    setFormData(prev => ({ 
      ...prev, 
      instructor_id: instructorId,
      instructor_name: instructor?.name || ''
    }));
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      selected_tags: prev.selected_tags.includes(tagId)
        ? prev.selected_tags.filter(id => id !== tagId)
        : [...prev.selected_tags, tagId]
    }));
  };

  const removeTag = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      selected_tags: prev.selected_tags.filter(id => id !== tagId)
    }));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Class Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructor_id">Instructor *</Label>
          <Select value={formData.instructor_id} onValueChange={handleInstructorChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select instructor" />
            </SelectTrigger>
            <SelectContent>
              {instructors.map((instructor) => (
                <SelectItem key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="class_type">Class Type *</Label>
          <Select value={formData.class_type} onValueChange={(value) => setFormData(prev => ({ ...prev, class_type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {classTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="class_level">Class Level *</Label>
          <Select value={formData.class_level} onValueChange={(value) => setFormData(prev => ({ ...prev, class_level: value as any }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {classLevels.map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes) *</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            required
            min="15"
            max="180"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="schedule_time">Class Time</Label>
          <Input
            id="schedule_time"
            type="time"
            value={formData.schedule_time}
            onChange={(e) => setFormData(prev => ({ ...prev, schedule_time: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={formData.timezone} onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz} value={tz}>{tz}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="featured_image_url">Featured Image URL</Label>
        <Input
          id="featured_image_url"
          type="url"
          value={formData.featured_image_url}
          onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="zoom_link">Zoom Meeting Link</Label>
        <Input
          id="zoom_link"
          type="url"
          value={formData.zoom_link}
          onChange={(e) => setFormData(prev => ({ ...prev, zoom_link: e.target.value }))}
          placeholder="https://zoom.us/j/123456789"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Class Tags</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {classTags.map((tag) => (
            <div key={tag.id} className="flex items-center space-x-2">
              <Checkbox
                id={tag.id}
                checked={formData.selected_tags.includes(tag.id)}
                onCheckedChange={() => handleTagToggle(tag.id)}
              />
              <Label htmlFor={tag.id} className="text-sm">{tag.name}</Label>
            </div>
          ))}
        </div>
        
        {formData.selected_tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.selected_tags.map((tagId) => {
              const tag = classTags.find(t => t.id === tagId);
              return tag ? (
                <Badge key={tagId} variant="secondary" className="flex items-center gap-1">
                  {tag.name}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => removeTag(tagId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked as boolean }))}
        />
        <Label htmlFor="is_active">Class is active</Label>
      </div>
    </>
  );
};
