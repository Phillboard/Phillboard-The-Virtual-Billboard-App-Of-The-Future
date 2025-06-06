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
      app_settings: {
        Row: {
          created_at: string | null
          id: number
          last_update_time: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: number
          last_update_time?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          last_update_time?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      phillboards: {
        Row: {
          content: string | null
          created_at: string
          id: string
          image_type: string | null
          lat: number
          lng: number
          placement_type: string | null
          title: string
          user_id: string | null
          username: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          image_type?: string | null
          lat: number
          lng: number
          placement_type?: string | null
          title: string
          user_id?: string | null
          username: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          image_type?: string | null
          lat?: number
          lng?: number
          placement_type?: string | null
          title?: string
          user_id?: string | null
          username?: string
        }
        Relationships: []
      }
      phillboards_edit_history: {
        Row: {
          cost: number
          created_at: string
          id: string
          original_creator_id: string | null
          phillboard_id: string
          user_id: string
        }
        Insert: {
          cost: number
          created_at?: string
          id?: string
          original_creator_id?: string | null
          phillboard_id: string
          user_id: string
        }
        Update: {
          cost?: number
          created_at?: string
          id?: string
          original_creator_id?: string | null
          phillboard_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "phillboards_edit_history_phillboard_id_fkey"
            columns: ["phillboard_id"]
            isOneToOne: false
            referencedRelation: "phillboards"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      user_balances: {
        Row: {
          balance: number
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id: string
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_to_balance: {
        Args: { user_id: string; amount: number }
        Returns: undefined
      }
      get_edit_count: {
        Args: { p_phillboard_id: string }
        Returns: number
      }
      get_most_edited_phillboards: {
        Args: { limit_count?: number }
        Returns: {
          phillboard_id: string
          title: string
          username: string
          edit_count: number
        }[]
      }
      get_top_creators: {
        Args: { limit_count?: number }
        Returns: {
          user_id: string
          username: string
          avatar_url: string
          phillboard_count: number
        }[]
      }
      get_top_earners: {
        Args: { limit_count?: number }
        Returns: {
          user_id: string
          username: string
          avatar_url: string
          earnings: number
        }[]
      }
      get_top_editors: {
        Args: { limit_count?: number }
        Returns: {
          user_id: string
          username: string
          avatar_url: string
          edit_count: number
        }[]
      }
      record_edit_history: {
        Args: { p_phillboard_id: string; p_user_id: string; p_cost: number }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
