export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      acquisitions: {
        Row: {
          acquisition_cost: number
          asking_price: number
          created_at: string
          estimated_value: number
          id: string
          land_area: number
          location: string
          market: string
          name: string
          planning: string
          potential_gfa: number
          projected_development: string
          projected_return: number
          recommendation: string
          risks: string
          stage: string
          title: string
        }
        Insert: {
          acquisition_cost?: number
          asking_price?: number
          created_at?: string
          estimated_value?: number
          id: string
          land_area?: number
          location?: string
          market?: string
          name: string
          planning?: string
          potential_gfa?: number
          projected_development?: string
          projected_return?: number
          recommendation?: string
          risks?: string
          stage?: string
          title?: string
        }
        Update: {
          acquisition_cost?: number
          asking_price?: number
          created_at?: string
          estimated_value?: number
          id?: string
          land_area?: number
          location?: string
          market?: string
          name?: string
          planning?: string
          potential_gfa?: number
          projected_development?: string
          projected_return?: number
          recommendation?: string
          risks?: string
          stage?: string
          title?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          acquisition_value: number
          asset_class: string
          buildings: number
          cashflow: Json
          commercial_area: number
          coords: Json
          created_at: string
          current_use: string
          current_value: number
          debt: number
          decisions: Json
          development_rights: string
          development_status: string
          documents: Json
          economics: Json
          geography: string
          gfa: number
          id: string
          invested_capital: number
          land_area: number
          lifecycle: string
          location: string
          name: string
          nfa: number
          occupancy: number
          opex: number
          ownership: string
          parking: number
          planning_status: string
          portfolio: string
          potential_gfa: number
          previous_value: number
          projected_irr: number
          projects: Json
          recommendation: Json
          residential_area: number
          revenue: number
          risk: string
          roi: number
          scenarios: Json
          strategy: string
          strategy_options: Json
          units: number
          updated_at: string
        }
        Insert: {
          acquisition_value?: number
          asset_class?: string
          buildings?: number
          cashflow?: Json
          commercial_area?: number
          coords?: Json
          created_at?: string
          current_use?: string
          current_value?: number
          debt?: number
          decisions?: Json
          development_rights?: string
          development_status?: string
          documents?: Json
          economics?: Json
          geography?: string
          gfa?: number
          id: string
          invested_capital?: number
          land_area?: number
          lifecycle?: string
          location?: string
          name: string
          nfa?: number
          occupancy?: number
          opex?: number
          ownership?: string
          parking?: number
          planning_status?: string
          portfolio?: string
          potential_gfa?: number
          previous_value?: number
          projected_irr?: number
          projects?: Json
          recommendation?: Json
          residential_area?: number
          revenue?: number
          risk?: string
          roi?: number
          scenarios?: Json
          strategy?: string
          strategy_options?: Json
          units?: number
          updated_at?: string
        }
        Update: {
          acquisition_value?: number
          asset_class?: string
          buildings?: number
          cashflow?: Json
          commercial_area?: number
          coords?: Json
          created_at?: string
          current_use?: string
          current_value?: number
          debt?: number
          decisions?: Json
          development_rights?: string
          development_status?: string
          documents?: Json
          economics?: Json
          geography?: string
          gfa?: number
          id?: string
          invested_capital?: number
          land_area?: number
          lifecycle?: string
          location?: string
          name?: string
          nfa?: number
          occupancy?: number
          opex?: number
          ownership?: string
          parking?: number
          planning_status?: string
          portfolio?: string
          potential_gfa?: number
          previous_value?: number
          projected_irr?: number
          projects?: Json
          recommendation?: Json
          residential_area?: number
          revenue?: number
          risk?: string
          roi?: number
          scenarios?: Json
          strategy?: string
          strategy_options?: Json
          units?: number
          updated_at?: string
        }
        Relationships: []
      }
      disposals: {
        Row: {
          asset_id: string | null
          created_at: string
          current_value: number
          debt: number
          exit_irr: number
          id: string
          name: string
          offer: number
          stage: string
          target_price: number
          transaction_costs: number
        }
        Insert: {
          asset_id?: string | null
          created_at?: string
          current_value?: number
          debt?: number
          exit_irr?: number
          id: string
          name: string
          offer?: number
          stage?: string
          target_price?: number
          transaction_costs?: number
        }
        Update: {
          asset_id?: string | null
          created_at?: string
          current_value?: number
          debt?: number
          exit_irr?: number
          id?: string
          name?: string
          offer?: number
          stage?: string
          target_price?: number
          transaction_costs?: number
        }
        Relationships: [
          {
            foreignKeyName: "disposals_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      risks: {
        Row: {
          asset_id: string | null
          category: string
          created_at: string
          evidence: string
          id: string
          impact: number
          mitigation: string
          owner: string
          severity: string
          status: string
        }
        Insert: {
          asset_id?: string | null
          category?: string
          created_at?: string
          evidence?: string
          id: string
          impact?: number
          mitigation?: string
          owner?: string
          severity?: string
          status?: string
        }
        Update: {
          asset_id?: string | null
          category?: string
          created_at?: string
          evidence?: string
          id?: string
          impact?: number
          mitigation?: string
          owner?: string
          severity?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "risks_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
