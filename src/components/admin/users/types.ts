
export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  membership_type: string | null;
  join_date: string | null;
  email?: string;
  phone?: string;
  roles?: string[];
}
