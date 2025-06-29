
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { HabitEntry } from '@/types/habits';

interface HabitCalendarProps {
  habitId?: string;
}

const HabitCalendar = ({ habitId }: HabitCalendarProps) => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;
      
      setLoading(true);
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      let query = supabase
        .from('habit_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('entry_date', startOfMonth.toISOString().split('T')[0])
        .lte('entry_date', endOfMonth.toISOString().split('T')[0]);

      if (habitId) {
        query = query.eq('habit_id', habitId);
      }

      try {
        const { data, error } = await query;
        if (error) throw error;
        setEntries(data || []);
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [user, currentMonth, habitId]);

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getEntryForDate = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString().split('T')[0];
    
    if (habitId) {
      return entries.find(entry => entry.entry_date === dateStr);
    } else {
      // For overall calendar, show if any habits were completed that day
      const dayEntries = entries.filter(entry => entry.entry_date === dateStr);
      const completedCount = dayEntries.filter(entry => entry.completed).length;
      return completedCount > 0 ? { completed: true, count: completedCount } : null;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">
            {habitId ? 'Habit Calendar' : 'Progress Calendar'}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <span className="font-medium text-gray-900 px-4">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map(empty => (
          <div key={`empty-${empty}`} className="p-2"></div>
        ))}
        
        {days.map(day => {
          const entry = getEntryForDate(day);
          const isToday = new Date().toDateString() === 
            new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
          
          return (
            <div
              key={day}
              className={`
                p-2 text-center text-sm border rounded transition-colors
                ${isToday ? 'border-purple-300 bg-purple-50' : 'border-gray-100'}
                ${entry?.completed ? 'bg-green-100 text-green-800' : 'text-gray-700'}
              `}
            >
              <div className="relative">
                {day}
                {entry?.completed && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-purple-50 border border-purple-200 rounded"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default HabitCalendar;
