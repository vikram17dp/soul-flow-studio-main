
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  membership_type: 'basic' | 'premium' | 'unlimited';
  join_date: string;
  phone: string | null;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}
