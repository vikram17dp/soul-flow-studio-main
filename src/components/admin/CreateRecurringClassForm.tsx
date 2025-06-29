
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { DayOfWeek } from './forms/ClassFormTypes';

const daysOfWeek = [
  { value: 'monday' as DayOfWeek, label: 'Monday' },
  { value: 'tuesday' as DayOfWeek, label: 'Tuesday' },
  { value: 'wednesday' as DayOfWeek, label: 'Wednesday' },
  { value: 'thursday' as DayOfWeek, label: 'Thursday' },
  { value: 'friday' as DayOfWeek, label: 'Friday' },
  { value: 'saturday' as DayOfWeek, label: 'Saturday' },
  { value: 'sunday' as DayOfWeek, label: 'Sunday' },
];

const timezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Australia/Sydney', label: 'Sydney' },
];

interface CreateRecurringClassFormProps {
  onSuccess?: () => void;
}

const CreateRecurringClassForm = ({ onSuccess }: CreateRecurringClassFormProps) => {
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [recurrenceType, setRecurrenceType] = useState<'weekly' | 'never_ending'>('weekly');
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      instructor_name: '',
      class_type: '',
      class_level: 'Beginner' as const,
      duration: 60,
      schedule_time: '',
      price: 0,
      timezone: 'UTC',
      start_date: new Date(),
      end_date: undefined as Date | undefined,
      zoom_link: '',
    }
  });

  const handleDayToggle = (day: DayOfWeek) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const onSubmit = async (data: any) => {
    if (selectedDays.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one day of the week',
        variant: 'destructive'
      });
      return;
    }

    try {
      console.log('Creating class with data:', data);
      console.log('Selected days:', selectedDays);
      console.log('Recurrence type:', recurrenceType);

      const classData = {
        title: data.title,
        description: data.description,
        instructor_name: data.instructor_name,
        class_type: data.class_type,
        class_level: data.class_level,
        duration: data.duration,
        schedule_time: data.schedule_time,
        price: data.price,
        timezone: data.timezone,
        start_date: data.start_date.toISOString().split('T')[0],
        end_date: recurrenceType === 'weekly' ? data.end_date?.toISOString().split('T')[0] : null,
        recurrence_type: recurrenceType,
        recurrence_days: selectedDays,
        zoom_link: data.zoom_link || null,
        is_active: true,
      };

      console.log('Final class data to insert:', classData);

      const { data: insertResult, error } = await supabase
        .from('classes')
        .insert(classData)
        .select();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      console.log('Class created successfully:', insertResult);

      toast({
        title: 'Success',
        description: 'Recurring class created successfully',
      });

      form.reset();
      setSelectedDays([]);
      setRecurrenceType('weekly');
      onSuccess?.();
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        title: 'Error',
        description: 'Failed to create class. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create Recurring Class</span>
        </CardTitle>
        <CardDescription>
          Set up a new recurring yoga class with automatic scheduling
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Morning Flow" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instructor_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Sarah Chen" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="class_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Vinyasa Flow" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="class_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="schedule_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timezones.map((timezone) => (
                          <SelectItem key={timezone.value} value={timezone.value}>
                            {timezone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zoom_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zoom Meeting Link</FormLabel>
                    <FormControl>
                      <Input 
                        type="url" 
                        placeholder="https://zoom.us/j/123456789" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Class description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Label>Days of the Week</Label>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {daysOfWeek.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.value}
                      checked={selectedDays.includes(day.value)}
                      onCheckedChange={() => handleDayToggle(day.value)}
                    />
                    <Label htmlFor={day.value} className="text-sm">
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Recurrence Type</Label>
              <Select value={recurrenceType} onValueChange={(value: 'weekly' | 'never_ending') => setRecurrenceType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly (with end date)</SelectItem>
                  <SelectItem value="never_ending">Never Ending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {recurrenceType === 'weekly' && (
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick an end date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < form.watch('start_date')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Button type="submit" className="w-full">
              Create Recurring Class
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateRecurringClassForm;
