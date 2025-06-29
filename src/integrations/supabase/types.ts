export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          class_id: string
          class_instance_id: string | null
          created_at: string | null
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          booking_date: string
          class_id: string
          class_instance_id?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          booking_date?: string
          class_id?: string
          class_instance_id?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_class_instance_id_fkey"
            columns: ["class_instance_id"]
            isOneToOne: false
            referencedRelation: "class_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      class_instances: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          class_id: string
          created_at: string | null
          id: string
          instance_date: string
          instance_time: string
          is_cancelled: boolean | null
          updated_at: string | null
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          class_id: string
          created_at?: string | null
          id?: string
          instance_date: string
          instance_time: string
          is_cancelled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          class_id?: string
          created_at?: string | null
          id?: string
          instance_date?: string
          instance_time?: string
          is_cancelled?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_instances_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_joins: {
        Row: {
          class_instance_id: string
          created_at: string | null
          id: string
          joined_at: string | null
          points_awarded: boolean | null
          user_id: string
        }
        Insert: {
          class_instance_id: string
          created_at?: string | null
          id?: string
          joined_at?: string | null
          points_awarded?: boolean | null
          user_id: string
        }
        Update: {
          class_instance_id?: string
          created_at?: string | null
          id?: string
          joined_at?: string | null
          points_awarded?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      class_tag_assignments: {
        Row: {
          class_id: string
          created_at: string
          id: string
          tag_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          tag_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_tag_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_tag_assignments_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "class_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      class_tags: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      classes: {
        Row: {
          class_level: string | null
          class_type: string
          created_at: string | null
          description: string | null
          duration: number
          end_date: string | null
          featured_image_url: string | null
          id: string
          image_url: string | null
          instructor_id: string | null
          instructor_name: string
          is_active: boolean | null
          price: number | null
          recurrence_days: Database["public"]["Enums"]["day_of_week"][] | null
          recurrence_type: Database["public"]["Enums"]["recurrence_type"] | null
          schedule_day: string | null
          schedule_time: string | null
          start_date: string | null
          timezone: string | null
          title: string
          updated_at: string | null
          zoom_link: string | null
        }
        Insert: {
          class_level?: string | null
          class_type: string
          created_at?: string | null
          description?: string | null
          duration: number
          end_date?: string | null
          featured_image_url?: string | null
          id?: string
          image_url?: string | null
          instructor_id?: string | null
          instructor_name: string
          is_active?: boolean | null
          price?: number | null
          recurrence_days?: Database["public"]["Enums"]["day_of_week"][] | null
          recurrence_type?:
            | Database["public"]["Enums"]["recurrence_type"]
            | null
          schedule_day?: string | null
          schedule_time?: string | null
          start_date?: string | null
          timezone?: string | null
          title: string
          updated_at?: string | null
          zoom_link?: string | null
        }
        Update: {
          class_level?: string | null
          class_type?: string
          created_at?: string | null
          description?: string | null
          duration?: number
          end_date?: string | null
          featured_image_url?: string | null
          id?: string
          image_url?: string | null
          instructor_id?: string | null
          instructor_name?: string
          is_active?: boolean | null
          price?: number | null
          recurrence_days?: Database["public"]["Enums"]["day_of_week"][] | null
          recurrence_type?:
            | Database["public"]["Enums"]["recurrence_type"]
            | null
          schedule_day?: string | null
          schedule_time?: string | null
          start_date?: string | null
          timezone?: string | null
          title?: string
          updated_at?: string | null
          zoom_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_entries: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          entry_date: string
          habit_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          entry_date?: string
          habit_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          entry_date?: string
          habit_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_entries_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_streaks: {
        Row: {
          best_streak: number
          created_at: string
          current_streak: number
          habit_id: string
          id: string
          last_completed_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          best_streak?: number
          created_at?: string
          current_streak?: number
          habit_id: string
          id?: string
          last_completed_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          best_streak?: number
          created_at?: string
          current_streak?: number
          habit_id?: string
          id?: string
          last_completed_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_streaks_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          created_at: string
          description: string | null
          habit_type: Database["public"]["Enums"]["habit_type"]
          icon: string
          id: string
          is_active: boolean
          name: string
          points_per_completion: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          habit_type: Database["public"]["Enums"]["habit_type"]
          icon: string
          id?: string
          is_active?: boolean
          name: string
          points_per_completion?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          habit_type?: Database["public"]["Enums"]["habit_type"]
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          points_per_completion?: number
          updated_at?: string
        }
        Relationships: []
      }
      instructors: {
        Row: {
          bio: string | null
          created_at: string
          experience_years: number | null
          id: string
          name: string
          profile_image_url: string | null
          specializations: string[] | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          experience_years?: number | null
          id?: string
          name: string
          profile_image_url?: string | null
          specializations?: string[] | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          experience_years?: number | null
          id?: string
          name?: string
          profile_image_url?: string | null
          specializations?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          category: string | null
          class_credits: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          duration_months: number
          features: string[] | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          original_price: number | null
          price: number
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          class_credits?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_months: number
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          original_price?: number | null
          price: number
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          class_credits?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_months?: number
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          original_price?: number | null
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          expires_at: string | null
          id: string
          package_id: string
          razorpay_order_id: string
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          package_id: string
          razorpay_order_id: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          package_id?: string
          razorpay_order_id?: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      point_rules: {
        Row: {
          activity_type: Database["public"]["Enums"]["point_activity_type"]
          conditions: Json | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          points_awarded: number
          updated_at: string
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["point_activity_type"]
          conditions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          points_awarded: number
          updated_at?: string
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["point_activity_type"]
          conditions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          points_awarded?: number
          updated_at?: string
        }
        Relationships: []
      }
      point_transactions: {
        Row: {
          activity_type: Database["public"]["Enums"]["point_activity_type"]
          admin_id: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          points: number
          reference_id: string | null
          reference_type: string | null
          transaction_type: Database["public"]["Enums"]["point_transaction_type"]
          user_id: string
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["point_activity_type"]
          admin_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          points: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: Database["public"]["Enums"]["point_transaction_type"]
          user_id: string
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["point_activity_type"]
          admin_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          points?: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: Database["public"]["Enums"]["point_transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          join_date: string | null
          membership_type: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          join_date?: string | null
          membership_type?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          join_date?: string | null
          membership_type?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_points: {
        Row: {
          created_at: string
          id: string
          lifetime_earned: number
          lifetime_redeemed: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lifetime_earned?: number
          lifetime_redeemed?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lifetime_earned?: number
          lifetime_redeemed?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          credits_remaining: number | null
          expires_at: string
          id: string
          package_id: string
          payment_id: string | null
          starts_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_remaining?: number | null
          expires_at: string
          id?: string
          package_id: string
          payment_id?: string | null
          starts_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_remaining?: number | null
          expires_at?: string
          id?: string
          package_id?: string
          payment_id?: string | null
          starts_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      weight_achievements: {
        Row: {
          achieved_at: string
          achievement_type: string
          created_at: string
          id: string
          points_awarded: number
          user_id: string
          weight_lost: number
        }
        Insert: {
          achieved_at?: string
          achievement_type: string
          created_at?: string
          id?: string
          points_awarded?: number
          user_id: string
          weight_lost: number
        }
        Update: {
          achieved_at?: string
          achievement_type?: string
          created_at?: string
          id?: string
          points_awarded?: number
          user_id?: string
          weight_lost?: number
        }
        Relationships: []
      }
      weight_entries: {
        Row: {
          created_at: string
          entry_date: string
          id: string
          notes: string | null
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          created_at?: string
          entry_date?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
          weight: number
        }
        Update: {
          created_at?: string
          entry_date?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      weight_goals: {
        Row: {
          created_at: string
          id: string
          start_date: string
          start_weight: number
          target_weight: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          start_date?: string
          start_weight: number
          target_weight?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          start_date?: string
          start_weight?: number
          target_weight?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_points: {
        Args: {
          _user_id: string
          _activity_type: Database["public"]["Enums"]["point_activity_type"]
          _reference_id?: string
          _reference_type?: string
          _admin_id?: string
          _custom_points?: number
          _description?: string
        }
        Returns: string
      }
      generate_class_instances: {
        Args: { p_class_id: string; p_start_date?: string; p_end_date?: string }
        Returns: number
      }
      get_all_users_for_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          full_name: string
          phone: string
          membership_type: string
          join_date: string
          avatar_url: string
          roles: string[]
        }[]
      }
      get_points_leaderboard: {
        Args: { category_filter?: string; days_filter?: number }
        Returns: {
          user_id: string
          full_name: string
          points: number
          rank: number
        }[]
      }
      get_user_habit_stats: {
        Args: { _user_id: string; _start_date?: string; _end_date?: string }
        Returns: {
          habit_id: string
          habit_name: string
          habit_icon: string
          current_streak: number
          best_streak: number
          completion_rate: number
          total_completions: number
        }[]
      }
      get_weight_loss_leaderboard: {
        Args: { days_filter?: number }
        Returns: {
          user_id: string
          full_name: string
          total_weight_lost: number
          latest_weight: number
          start_weight: number
          entries_count: number
          rank: number
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      update_membership_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      day_of_week:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
      habit_type:
        | "eat_when_hungry"
        | "eat_well_not_less"
        | "eat_salad_before_meals"
        | "say_no_to_sugar"
        | "say_no_to_processed_foods"
      point_activity_type:
        | "class_attendance"
        | "class_booking"
        | "referral"
        | "signup_bonus"
        | "weekly_streak"
        | "monthly_streak"
        | "review_submission"
        | "profile_completion"
        | "admin_adjustment"
        | "habit_completion"
        | "daily_habit_bonus"
        | "habit_streak_bonus"
        | "class_join"
      point_transaction_type:
        | "earned"
        | "redeemed"
        | "bonus"
        | "penalty"
        | "adjustment"
      recurrence_type: "weekly" | "never_ending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      day_of_week: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      habit_type: [
        "eat_when_hungry",
        "eat_well_not_less",
        "eat_salad_before_meals",
        "say_no_to_sugar",
        "say_no_to_processed_foods",
      ],
      point_activity_type: [
        "class_attendance",
        "class_booking",
        "referral",
        "signup_bonus",
        "weekly_streak",
        "monthly_streak",
        "review_submission",
        "profile_completion",
        "admin_adjustment",
        "habit_completion",
        "daily_habit_bonus",
        "habit_streak_bonus",
        "class_join",
      ],
      point_transaction_type: [
        "earned",
        "redeemed",
        "bonus",
        "penalty",
        "adjustment",
      ],
      recurrence_type: ["weekly", "never_ending"],
    },
  },
} as const
