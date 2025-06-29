
import { Repeat } from 'lucide-react';
import { daysOfWeek } from '@/components/admin/forms/ClassFormConstants';

interface ClassRecurrenceDisplayProps {
  recurrenceDays: string[] | null;
  recurrenceType: string | null;
  className?: string;
}

export const ClassRecurrenceDisplay = ({ 
  recurrenceDays, 
  recurrenceType, 
  className = "" 
}: ClassRecurrenceDisplayProps) => {
  if (!recurrenceDays || !recurrenceType || recurrenceDays.length === 0) {
    return null;
  }

  const formatRecurrenceDays = (days: string[]) => {
    const dayMap = daysOfWeek.reduce((acc, day) => {
      acc[day.value] = day.short;
      return acc;
    }, {} as Record<string, string>);

    const shortDays = days.map(day => dayMap[day]).filter(Boolean);
    
    if (shortDays.length === 0) return '';
    if (shortDays.length === 1) return `Every ${shortDays[0]}`;
    if (shortDays.length === 2) return `Every ${shortDays[0]} & ${shortDays[1]}`;
    
    const lastDay = shortDays.pop();
    return `Every ${shortDays.join(', ')} & ${lastDay}`;
  };

  return (
    <div className={`flex items-center space-x-1 text-sm text-purple-600 ${className}`}>
      <Repeat className="h-4 w-4" />
      <span>{formatRecurrenceDays(recurrenceDays)}</span>
    </div>
  );
};
