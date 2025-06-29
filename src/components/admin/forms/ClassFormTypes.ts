
export type RecurrenceType = 'weekly' | 'never_ending' | 'none';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type ClassLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Instructor {
  id: string;
  name: string;
  bio: string | null;
  experience_years: number | null;
  specializations: string[] | null;
  profile_image_url: string | null;
}

export interface ClassTag {
  id: string;
  name: string;
  color: string;
}

export interface YogaClass {
  id: string;
  title: string;
  description: string | null;
  instructor_name: string;
  instructor_id: string | null;
  class_type: string;
  class_level: ClassLevel;
  duration: number;
  price: number | null;
  schedule_day: string | null;
  schedule_time: string | null;
  is_active: boolean | null;
  recurrence_type: string | null;
  recurrence_days: string[] | null;
  timezone: string | null;
  featured_image_url: string | null;
  zoom_link: string | null;
}

export interface ClassFormData {
  title: string;
  description: string;
  instructor_name: string;
  instructor_id: string;
  class_type: string;
  class_level: ClassLevel;
  duration: number;
  price: number;
  schedule_time: string;
  recurrence_type: RecurrenceType;
  recurrence_days: DayOfWeek[];
  timezone: string;
  is_active: boolean;
  featured_image_url: string;
  zoom_link: string;
  selected_tags: string[];
}
