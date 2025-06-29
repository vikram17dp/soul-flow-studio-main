
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ClassFormData, RecurrenceType, DayOfWeek } from './ClassFormTypes';
import { daysOfWeek } from './ClassFormConstants';

interface RecurrenceSettingsProps {
  formData: ClassFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClassFormData>>;
}

export const RecurrenceSettings = ({ formData, setFormData }: RecurrenceSettingsProps) => {
  const handleDayToggle = (day: DayOfWeek, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      recurrence_days: checked 
        ? [...prev.recurrence_days, day]
        : prev.recurrence_days.filter(d => d !== day)
    }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recurrence_type">Recurrence Type</Label>
        <Select 
          value={formData.recurrence_type} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, recurrence_type: value as RecurrenceType }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select recurrence type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Recurrence</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="never_ending">Never Ending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.recurrence_type && formData.recurrence_type !== 'none' && (
        <div className="space-y-2">
          <Label>Days of the Week</Label>
          <div className="flex flex-wrap gap-4">
            {daysOfWeek.map((day) => (
              <div key={day.value} className="flex items-center space-x-2">
                <Checkbox
                  id={day.value}
                  checked={formData.recurrence_days.includes(day.value)}
                  onCheckedChange={(checked) => handleDayToggle(day.value, checked as boolean)}
                />
                <Label htmlFor={day.value}>{day.label}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
