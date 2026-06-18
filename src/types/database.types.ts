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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      claim_documents: {
        Row: {
          claim_id: string
          created_at: string
          document_name: string
          file_url: string | null
          id: string
          is_submitted: boolean
          notes: string | null
          shop_id: string
          submitted_at: string | null
        }
        Insert: {
          claim_id: string
          created_at?: string
          document_name: string
          file_url?: string | null
          id?: string
          is_submitted?: boolean
          notes?: string | null
          shop_id: string
          submitted_at?: string | null
        }
        Update: {
          claim_id?: string
          created_at?: string
          document_name?: string
          file_url?: string | null
          id?: string
          is_submitted?: boolean
          notes?: string | null
          shop_id?: string
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claim_documents_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "insurance_claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_documents_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          deleted_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          shop_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          shop_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          shop_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      film_cuts: {
        Row: {
          car_type: string
          cut_at: string
          cut_by: string | null
          film_roll_id: string
          id: string
          job_id: string | null
          length_used_m: number
          notes: string | null
          positions: string[]
          remaining_after_m: number
          shop_id: string
        }
        Insert: {
          car_type: string
          cut_at?: string
          cut_by?: string | null
          film_roll_id: string
          id?: string
          job_id?: string | null
          length_used_m: number
          notes?: string | null
          positions: string[]
          remaining_after_m: number
          shop_id: string
        }
        Update: {
          car_type?: string
          cut_at?: string
          cut_by?: string | null
          film_roll_id?: string
          id?: string
          job_id?: string | null
          length_used_m?: number
          notes?: string | null
          positions?: string[]
          remaining_after_m?: number
          shop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "film_cuts_cut_by_fkey"
            columns: ["cut_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "film_cuts_film_roll_id_fkey"
            columns: ["film_roll_id"]
            isOneToOne: false
            referencedRelation: "film_rolls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "film_cuts_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "film_cuts_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      film_rolls: {
        Row: {
          brand: string | null
          color_hex: string
          created_at: string
          deleted_at: string | null
          id: string
          is_active: boolean
          min_length_alert_m: number
          name: string
          remaining_length_m: number
          shop_id: string
          specification: string | null
          total_length_m: number
          updated_at: string
          width_cm: number
        }
        Insert: {
          brand?: string | null
          color_hex?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean
          min_length_alert_m?: number
          name: string
          remaining_length_m: number
          shop_id: string
          specification?: string | null
          total_length_m: number
          updated_at?: string
          width_cm: number
        }
        Update: {
          brand?: string | null
          color_hex?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean
          min_length_alert_m?: number
          name?: string
          remaining_length_m?: number
          shop_id?: string
          specification?: string | null
          total_length_m?: number
          updated_at?: string
          width_cm?: number
        }
        Relationships: [
          {
            foreignKeyName: "film_rolls_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      film_templates: {
        Row: {
          car_type: string
          id: string
          length_m: number
          margin_m: number
          position: string
          shop_id: string | null
        }
        Insert: {
          car_type: string
          id?: string
          length_m: number
          margin_m?: number
          position: string
          shop_id?: string | null
        }
        Update: {
          car_type?: string
          id?: string
          length_m?: number
          margin_m?: number
          position?: string
          shop_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "film_templates_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_claims: {
        Row: {
          approved_amount: number | null
          approved_at: string | null
          claim_amount: number | null
          claim_number: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          id: string
          insurance_company: string
          job_id: string | null
          job_type: Database["public"]["Enums"]["job_type"]
          license_plate: string
          notes: string | null
          paid_at: string | null
          policy_number: string | null
          shop_id: string
          status: Database["public"]["Enums"]["claim_status"]
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          approved_amount?: number | null
          approved_at?: string | null
          claim_amount?: number | null
          claim_number: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          insurance_company: string
          job_id?: string | null
          job_type: Database["public"]["Enums"]["job_type"]
          license_plate: string
          notes?: string | null
          paid_at?: string | null
          policy_number?: string | null
          shop_id: string
          status?: Database["public"]["Enums"]["claim_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          approved_amount?: number | null
          approved_at?: string | null
          claim_amount?: number | null
          claim_number?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          insurance_company?: string
          job_id?: string | null
          job_type?: Database["public"]["Enums"]["job_type"]
          license_plate?: string
          notes?: string | null
          paid_at?: string | null
          policy_number?: string | null
          shop_id?: string
          status?: Database["public"]["Enums"]["claim_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_claims_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_claims_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_claims_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          description: string
          id: string
          invoice_id: string
          line_total: number | null
          quantity: number
          shop_id: string
          sort_order: number
          stock_item_id: string | null
          unit_price: number
        }
        Insert: {
          description: string
          id?: string
          invoice_id: string
          line_total?: number | null
          quantity?: number
          shop_id: string
          sort_order?: number
          stock_item_id?: string | null
          unit_price: number
        }
        Update: {
          description?: string
          id?: string
          invoice_id?: string
          line_total?: number | null
          quantity?: number
          shop_id?: string
          sort_order?: number
          stock_item_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_stock_item_id_fkey"
            columns: ["stock_item_id"]
            isOneToOne: false
            referencedRelation: "stock_items"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          billed_to_name: string | null
          billed_to_phone: string | null
          claim_id: string | null
          created_at: string
          customer_id: string | null
          deleted_at: string | null
          id: string
          invoice_number: string
          issued_at: string | null
          issued_by: string | null
          job_id: string | null
          license_plate: string | null
          notes: string | null
          paid_amount: number | null
          paid_at: string | null
          payment_method: string | null
          shop_id: string
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          total: number | null
          updated_at: string
          vat_amount: number | null
          vat_rate: number
        }
        Insert: {
          billed_to_name?: string | null
          billed_to_phone?: string | null
          claim_id?: string | null
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          id?: string
          invoice_number: string
          issued_at?: string | null
          issued_by?: string | null
          job_id?: string | null
          license_plate?: string | null
          notes?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          payment_method?: string | null
          shop_id: string
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          total?: number | null
          updated_at?: string
          vat_amount?: number | null
          vat_rate?: number
        }
        Update: {
          billed_to_name?: string | null
          billed_to_phone?: string | null
          claim_id?: string | null
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          id?: string
          invoice_number?: string
          issued_at?: string | null
          issued_by?: string | null
          job_id?: string | null
          license_plate?: string | null
          notes?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          payment_method?: string | null
          shop_id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          total?: number | null
          updated_at?: string
          vat_amount?: number | null
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "insurance_claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      job_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string
          due_date: string | null
          id: string
          is_primary: boolean
          job_id: string
          shop_id: string
          technician_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          is_primary?: boolean
          job_id: string
          shop_id: string
          technician_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          is_primary?: boolean
          job_id?: string
          shop_id?: string
          technician_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_assignments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_assignments_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_assignments_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_damage_checklist: {
        Row: {
          created_at: string
          id: string
          is_damaged: boolean
          item: string
          job_id: string
          notes: string | null
          photo_urls: string[]
          shop_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_damaged?: boolean
          item: string
          job_id: string
          notes?: string | null
          photo_urls?: string[]
          shop_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_damaged?: boolean
          item?: string
          job_id?: string
          notes?: string | null
          photo_urls?: string[]
          shop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_damage_checklist_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_damage_checklist_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      job_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          from_status: Database["public"]["Enums"]["job_status"] | null
          id: string
          job_id: string
          note: string | null
          shop_id: string
          to_status: Database["public"]["Enums"]["job_status"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["job_status"] | null
          id?: string
          job_id: string
          note?: string | null
          shop_id: string
          to_status: Database["public"]["Enums"]["job_status"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["job_status"] | null
          id?: string
          job_id?: string
          note?: string | null
          shop_id?: string
          to_status?: Database["public"]["Enums"]["job_status"]
        }
        Relationships: [
          {
            foreignKeyName: "job_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_status_history_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_status_history_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          customer_id: string | null
          deleted_at: string | null
          delivered_at: string | null
          id: string
          insurance_company: string | null
          is_insurance_claim: boolean
          job_number: string
          job_type: Database["public"]["Enums"]["job_type"]
          notes: string | null
          odometer_in: number | null
          price: number
          progress: number
          received_at: string | null
          scheduled_date: string | null
          shop_id: string
          status: Database["public"]["Enums"]["job_status"]
          technician_id: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          deleted_at?: string | null
          delivered_at?: string | null
          id?: string
          insurance_company?: string | null
          is_insurance_claim?: boolean
          job_number: string
          job_type?: Database["public"]["Enums"]["job_type"]
          notes?: string | null
          odometer_in?: number | null
          price?: number
          progress?: number
          received_at?: string | null
          scheduled_date?: string | null
          shop_id: string
          status?: Database["public"]["Enums"]["job_status"]
          technician_id?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          deleted_at?: string | null
          delivered_at?: string | null
          id?: string
          insurance_company?: string | null
          is_insurance_claim?: boolean
          job_number?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          notes?: string | null
          odometer_in?: number | null
          price?: number
          progress?: number
          received_at?: string | null
          scheduled_date?: string | null
          shop_id?: string
          status?: Database["public"]["Enums"]["job_status"]
          technician_id?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          error_msg: string | null
          event: Database["public"]["Enums"]["notification_event"]
          id: string
          payload: Json
          recipient: string
          sent_at: string | null
          shop_id: string
          status: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          error_msg?: string | null
          event: Database["public"]["Enums"]["notification_event"]
          id?: string
          payload?: Json
          recipient: string
          sent_at?: string | null
          shop_id: string
          status?: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          error_msg?: string | null
          event?: Database["public"]["Enums"]["notification_event"]
          id?: string
          payload?: Json
          recipient?: string
          sent_at?: string | null
          shop_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_rules: {
        Row: {
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          event: Database["public"]["Enums"]["notification_event"]
          id: string
          is_enabled: boolean
          shop_id: string
          template: string | null
        }
        Insert: {
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          event: Database["public"]["Enums"]["notification_event"]
          id?: string
          is_enabled?: boolean
          shop_id: string
          template?: string | null
        }
        Update: {
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          event?: Database["public"]["Enums"]["notification_event"]
          id?: string
          is_enabled?: boolean
          shop_id?: string
          template?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_rules_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_color: string
          created_at: string
          display_name: string
          id: string
          is_active: boolean
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          shop_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_color?: string
          created_at?: string
          display_name: string
          id: string
          is_active?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          shop_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_color?: string
          created_at?: string
          display_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          shop_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["user_role"]
          shop_id: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role: Database["public"]["Enums"]["user_role"]
          shop_id: string
          token?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          shop_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_invitations_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          address: string | null
          created_at: string
          deleted_at: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          settings: Json
          slug: string
          tax_id: string | null
          updated_at: string
          vat_rate: number
        }
        Insert: {
          address?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          settings?: Json
          slug: string
          tax_id?: string | null
          updated_at?: string
          vat_rate?: number
        }
        Update: {
          address?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          settings?: Json
          slug?: string
          tax_id?: string | null
          updated_at?: string
          vat_rate?: number
        }
        Relationships: []
      }
      stock_items: {
        Row: {
          category: Database["public"]["Enums"]["stock_category"]
          cost_price: number
          created_at: string
          deleted_at: string | null
          id: string
          location_note: string | null
          min_quantity: number
          name: string
          name_en: string | null
          position: Database["public"]["Enums"]["glass_position"] | null
          product_code: string
          quantity: number
          selling_price: number
          shop_id: string
          status: Database["public"]["Enums"]["stock_status"] | null
          supplier_name: string | null
          updated_at: string
          vehicle_make: string | null
          vehicle_model: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["stock_category"]
          cost_price?: number
          created_at?: string
          deleted_at?: string | null
          id?: string
          location_note?: string | null
          min_quantity?: number
          name: string
          name_en?: string | null
          position?: Database["public"]["Enums"]["glass_position"] | null
          product_code: string
          quantity?: number
          selling_price?: number
          shop_id: string
          status?: Database["public"]["Enums"]["stock_status"] | null
          supplier_name?: string | null
          updated_at?: string
          vehicle_make?: string | null
          vehicle_model?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["stock_category"]
          cost_price?: number
          created_at?: string
          deleted_at?: string | null
          id?: string
          location_note?: string | null
          min_quantity?: number
          name?: string
          name_en?: string | null
          position?: Database["public"]["Enums"]["glass_position"] | null
          product_code?: string
          quantity?: number
          selling_price?: number
          shop_id?: string
          status?: Database["public"]["Enums"]["stock_status"] | null
          supplier_name?: string | null
          updated_at?: string
          vehicle_make?: string | null
          vehicle_model?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_items_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          job_id: string | null
          movement_type: string
          quantity_after: number
          quantity_delta: number
          reference: string | null
          shop_id: string
          stock_item_id: string
          supplier_name: string | null
          unit_cost: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          job_id?: string | null
          movement_type: string
          quantity_after: number
          quantity_delta: number
          reference?: string | null
          shop_id: string
          stock_item_id: string
          supplier_name?: string | null
          unit_cost?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          job_id?: string | null
          movement_type?: string
          quantity_after?: number
          quantity_delta?: number
          reference?: string | null
          shop_id?: string
          stock_item_id?: string
          supplier_name?: string | null
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_stock_item_id_fkey"
            columns: ["stock_item_id"]
            isOneToOne: false
            referencedRelation: "stock_items"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_capacity: {
        Row: {
          id: string
          is_available: boolean
          max_jobs: number
          shop_id: string
          technician_id: string
          work_date: string
        }
        Insert: {
          id?: string
          is_available?: boolean
          max_jobs?: number
          shop_id: string
          technician_id: string
          work_date?: string
        }
        Update: {
          id?: string
          is_available?: boolean
          max_jobs?: number
          shop_id?: string
          technician_id?: string
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_capacity_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_capacity_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          color: string | null
          created_at: string
          customer_id: string | null
          id: string
          license_plate: string
          make: string
          model: string
          notes: string | null
          shop_id: string
          updated_at: string
          year: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          license_plate: string
          make: string
          model: string
          notes?: string | null
          shop_id: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          license_plate?: string
          make?: string
          model?: string
          notes?: string | null
          shop_id?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      auth_shop_id: { Args: never; Returns: string }
    }
    Enums: {
      claim_status:
        | "waiting_docs"
        | "in_progress"
        | "approved"
        | "rejected"
        | "paid"
      glass_position: "front" | "side_left" | "side_right" | "rear"
      invoice_status:
        | "draft"
        | "pending_payment"
        | "paid"
        | "waiting_insurance"
        | "cancelled"
      job_status:
        | "quote"
        | "pending"
        | "in_progress"
        | "waiting_parts"
        | "claim"
        | "done_waiting"
        | "delivered"
        | "cancelled"
      job_type:
        | "windshield_replace"
        | "side_glass_replace"
        | "rear_glass_replace"
        | "film_tint"
        | "crack_repair"
        | "insurance_claim"
        | "other"
      notification_channel: "sms" | "line" | "in_app"
      notification_event:
        | "job_created"
        | "job_status_changed"
        | "job_completed"
        | "claim_status_changed"
        | "stock_low"
        | "invoice_issued"
        | "payment_received"
      stock_category: "glass" | "film" | "seal_rubber" | "tool" | "other"
      stock_status: "adequate" | "low" | "near_out" | "out_of_stock"
      user_role: "owner" | "manager" | "technician" | "accountant"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      claim_status: [
        "waiting_docs",
        "in_progress",
        "approved",
        "rejected",
        "paid",
      ],
      glass_position: ["front", "side_left", "side_right", "rear"],
      invoice_status: [
        "draft",
        "pending_payment",
        "paid",
        "waiting_insurance",
        "cancelled",
      ],
      job_status: [
        "quote",
        "pending",
        "in_progress",
        "waiting_parts",
        "claim",
        "done_waiting",
        "delivered",
        "cancelled",
      ],
      job_type: [
        "windshield_replace",
        "side_glass_replace",
        "rear_glass_replace",
        "film_tint",
        "crack_repair",
        "insurance_claim",
        "other",
      ],
      notification_channel: ["sms", "line", "in_app"],
      notification_event: [
        "job_created",
        "job_status_changed",
        "job_completed",
        "claim_status_changed",
        "stock_low",
        "invoice_issued",
        "payment_received",
      ],
      stock_category: ["glass", "film", "seal_rubber", "tool", "other"],
      stock_status: ["adequate", "low", "near_out", "out_of_stock"],
      user_role: ["owner", "manager", "technician", "accountant"],
    },
  },
} as const
