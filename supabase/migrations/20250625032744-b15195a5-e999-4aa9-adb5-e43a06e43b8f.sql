
-- Create enum for habit types
CREATE TYPE public.habit_type AS ENUM (
  'eat_when_hungry',
  'eat_well_not_less', 
  'eat_salad_before_meals',
  'say_no_to_sugar',
  'say_no_to_processed_foods'
);

-- Create habits table to define the 5 core habits
CREATE TABLE public.habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_type public.habit_type NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  points_per_completion INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create habit_entries table to track daily completions
CREATE TABLE public.habit_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, habit_id, entry_date)
);

-- Create habit_streaks table to track streaks
CREATE TABLE public.habit_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  last_completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, habit_id)
);

-- Enable RLS on all tables
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for habits (everyone can read, admins can manage)
CREATE POLICY "Everyone can view habits" 
  ON public.habits 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage habits" 
  ON public.habits 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for habit_entries
CREATE POLICY "Users can view their own habit entries" 
  ON public.habit_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habit entries" 
  ON public.habit_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit entries" 
  ON public.habit_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id AND entry_date = CURRENT_DATE);

CREATE POLICY "Admins can view all habit entries" 
  ON public.habit_entries 
  FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for habit_streaks
CREATE POLICY "Users can view their own streaks" 
  ON public.habit_streaks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage streaks" 
  ON public.habit_streaks 
  FOR ALL 
  WITH CHECK (true);

CREATE POLICY "Admins can view all streaks" 
  ON public.habit_streaks 
  FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default habits
INSERT INTO public.habits (habit_type, name, description, icon, points_per_completion) VALUES
  ('eat_when_hungry', 'Eat Only When Hungry', 'Listen to your body and eat only when you feel genuine hunger', '🍽️', 10),
  ('eat_well_not_less', 'Eat Well, Don''t Eat Less', 'Focus on nutritious foods rather than restricting quantity', '🍛', 10),
  ('eat_salad_before_meals', 'Eat Salad Before Lunch & Dinner', 'Have a salad before main meals until 50% stomach full', '🥗', 10),
  ('say_no_to_sugar', 'Say No to Sugar & Sugary Foods', 'Avoid sugar and sugary processed foods throughout the day', '🚫', 10),
  ('say_no_to_processed_foods', 'Say No to Processed Foods', 'Choose whole, natural foods over processed alternatives', '🚫', 10);

-- Insert point rules for habits
INSERT INTO public.point_rules (activity_type, points_awarded, description) VALUES
  ('habit_completion', 10, 'Points for completing a daily habit'),
  ('daily_habit_bonus', 50, 'Bonus points for completing all 5 habits in a day'),
  ('habit_streak_bonus', 30, 'Bonus points for maintaining habit streaks (3+ days)');

-- Function to update habit streaks and award points
CREATE OR REPLACE FUNCTION public.update_habit_streaks()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  streak_record INTEGER;
  yesterday_date DATE;
  completed_habits_count INTEGER;
BEGIN
  yesterday_date := NEW.entry_date - INTERVAL '1 day';
  
  -- Insert or update streak record
  INSERT INTO public.habit_streaks (user_id, habit_id, current_streak, best_streak, last_completed_date)
  VALUES (NEW.user_id, NEW.habit_id, 
    CASE WHEN NEW.completed THEN 1 ELSE 0 END,
    CASE WHEN NEW.completed THEN 1 ELSE 0 END,
    CASE WHEN NEW.completed THEN NEW.entry_date ELSE NULL END
  )
  ON CONFLICT (user_id, habit_id) 
  DO UPDATE SET
    current_streak = CASE 
      WHEN NEW.completed THEN 
        CASE 
          WHEN habit_streaks.last_completed_date = yesterday_date THEN habit_streaks.current_streak + 1
          ELSE 1
        END
      ELSE 0
    END,
    best_streak = CASE 
      WHEN NEW.completed THEN 
        GREATEST(habit_streaks.best_streak, 
          CASE 
            WHEN habit_streaks.last_completed_date = yesterday_date THEN habit_streaks.current_streak + 1
            ELSE 1
          END
        )
      ELSE habit_streaks.best_streak
    END,
    last_completed_date = CASE WHEN NEW.completed THEN NEW.entry_date ELSE habit_streaks.last_completed_date END,
    updated_at = now();

  -- Award points for habit completion
  IF NEW.completed THEN
    PERFORM public.award_points(
      NEW.user_id,
      'habit_completion'::public.point_activity_type,
      NEW.id,
      'habit_entry',
      NULL,
      NULL,
      'Completed habit: ' || (SELECT name FROM public.habits WHERE id = NEW.habit_id)
    );
    
    -- Check if all 5 habits completed today
    SELECT COUNT(*) INTO completed_habits_count
    FROM public.habit_entries he
    JOIN public.habits h ON he.habit_id = h.id
    WHERE he.user_id = NEW.user_id 
      AND he.entry_date = NEW.entry_date 
      AND he.completed = true
      AND h.is_active = true;
    
    -- Award daily bonus if all habits completed
    IF completed_habits_count = 5 THEN
      PERFORM public.award_points(
        NEW.user_id,
        'daily_habit_bonus'::public.point_activity_type,
        NEW.id,
        'daily_habits',
        NULL,
        NULL,
        'Completed all 5 habits today!'
      );
    END IF;
    
    -- Award streak bonuses
    SELECT current_streak INTO streak_record
    FROM public.habit_streaks
    WHERE user_id = NEW.user_id AND habit_id = NEW.habit_id;
    
    IF streak_record IS NOT NULL THEN
      -- Award streak bonus for 3-day and 7-day streaks
      IF streak_record = 3 THEN
        PERFORM public.award_points(
          NEW.user_id,
          'habit_streak_bonus'::public.point_activity_type,
          NEW.id,
          'habit_streak',
          NULL,
          30,
          '3-day habit streak bonus!'
        );
      ELSIF streak_record = 7 THEN
        PERFORM public.award_points(
          NEW.user_id,
          'habit_streak_bonus'::public.point_activity_type,
          NEW.id,
          'habit_streak',
          NULL,
          100,
          '7-day habit streak bonus!'
        );
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for habit streak updates
CREATE TRIGGER update_habit_streaks_trigger
  AFTER INSERT OR UPDATE ON public.habit_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_habit_streaks();

-- Function to get habit stats for a user
CREATE OR REPLACE FUNCTION public.get_user_habit_stats(
  _user_id UUID,
  _start_date DATE DEFAULT CURRENT_DATE - INTERVAL '7 days',
  _end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  habit_id UUID,
  habit_name TEXT,
  habit_icon TEXT,
  current_streak INTEGER,
  best_streak INTEGER,
  completion_rate DECIMAL,
  total_completions BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.id as habit_id,
    h.name as habit_name,
    h.icon as habit_icon,
    COALESCE(hs.current_streak, 0) as current_streak,
    COALESCE(hs.best_streak, 0) as best_streak,
    ROUND(
      COALESCE(
        (COUNT(CASE WHEN he.completed THEN 1 END)::DECIMAL / 
         NULLIF((_end_date - _start_date + 1), 0)) * 100, 
        0
      ), 1
    ) as completion_rate,
    COUNT(CASE WHEN he.completed THEN 1 END) as total_completions
  FROM public.habits h
  LEFT JOIN public.habit_streaks hs ON h.id = hs.habit_id AND hs.user_id = _user_id
  LEFT JOIN public.habit_entries he ON h.id = he.habit_id 
    AND he.user_id = _user_id 
    AND he.entry_date BETWEEN _start_date AND _end_date
  WHERE h.is_active = true
  GROUP BY h.id, h.name, h.icon, hs.current_streak, hs.best_streak
  ORDER BY h.created_at;
END;
$$;
