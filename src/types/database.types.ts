export type Database = {
  public: {
    Tables: {
      shops: {
        Row: {
          id: string
          name: string
          slug: string
          address: string | null
          phone: string | null
          tax_id: string | null
          logo_url: string | null
          vat_rate: string
          settings: Record<string, unknown>
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['shops']['Row']> & { name: string; slug: string }
        Update: Partial<Database['public']['Tables']['shops']['Row']>
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          shop_id: string | null
          role: Database['public']['Enums']['user_role']
          display_name: string
          phone: string | null
          avatar_color: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string; display_name: string }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
        Relationships: []
      }
      shop_invitations: {
        Row: {
          id: string
          shop_id: string
          email: string
          role: Database['public']['Enums']['user_role']
          token: string
          invited_by: string | null
          expires_at: string
          accepted_at: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['shop_invitations']['Row']> & { shop_id: string; email: string; role: Database['public']['Enums']['user_role'] }
        Update: Partial<Database['public']['Tables']['shop_invitations']['Row']>
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          shop_id: string
          name: string
          phone: string | null
          email: string | null
          notes: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['customers']['Row']> & { shop_id: string; name: string }
        Update: Partial<Database['public']['Tables']['customers']['Row']>
        Relationships: []
      }
      vehicles: {
        Row: {
          id: string
          shop_id: string
          customer_id: string | null
          license_plate: string
          make: string
          model: string
          year: number | null
          color: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['vehicles']['Row']> & { shop_id: string; license_plate: string; make: string; model: string }
        Update: Partial<Database['public']['Tables']['vehicles']['Row']>
        Relationships: []
      }
      jobs: {
        Row: {
          id: string
          shop_id: string
          job_number: string
          vehicle_id: string | null
          customer_id: string | null
          technician_id: string | null
          job_type: Database['public']['Enums']['job_type']
          status: Database['public']['Enums']['job_status']
          price: string
          notes: string | null
          scheduled_date: string | null
          received_at: string | null
          completed_at: string | null
          delivered_at: string | null
          odometer_in: number | null
          progress: number
          insurance_company: string | null
          is_insurance_claim: boolean
          created_by: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['jobs']['Row']> & { shop_id: string; job_number: string }
        Update: Partial<Database['public']['Tables']['jobs']['Row']>
        Relationships: []
      }
      job_status_history: {
        Row: {
          id: string
          job_id: string
          shop_id: string
          from_status: Database['public']['Enums']['job_status'] | null
          to_status: Database['public']['Enums']['job_status']
          changed_by: string | null
          note: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['job_status_history']['Row']> & { job_id: string; shop_id: string; to_status: Database['public']['Enums']['job_status'] }
        Update: Partial<Database['public']['Tables']['job_status_history']['Row']>
        Relationships: []
      }
      job_damage_checklist: {
        Row: {
          id: string
          job_id: string
          shop_id: string
          item: string
          is_damaged: boolean
          notes: string | null
          photo_urls: string[]
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['job_damage_checklist']['Row']> & { job_id: string; shop_id: string; item: string }
        Update: Partial<Database['public']['Tables']['job_damage_checklist']['Row']>
        Relationships: []
      }
      stock_items: {
        Row: {
          id: string
          shop_id: string
          product_code: string
          name: string
          name_en: string | null
          category: Database['public']['Enums']['stock_category']
          vehicle_make: string | null
          vehicle_model: string | null
          position: Database['public']['Enums']['glass_position'] | null
          quantity: number
          min_quantity: number
          cost_price: string
          selling_price: string
          supplier_name: string | null
          location_note: string | null
          status: Database['public']['Enums']['stock_status']
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['stock_items']['Row']> & { shop_id: string; product_code: string; name: string; status?: never }
        Update: Partial<Database['public']['Tables']['stock_items']['Row']> & { status?: never }
        Relationships: []
      }
      stock_movements: {
        Row: {
          id: string
          shop_id: string
          stock_item_id: string
          job_id: string | null
          movement_type: 'in' | 'out' | 'adjustment'
          quantity_delta: number
          quantity_after: number
          unit_cost: string | null
          supplier_name: string | null
          reference: string | null
          created_by: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['stock_movements']['Row']> & { shop_id: string; stock_item_id: string; movement_type: 'in' | 'out' | 'adjustment'; quantity_delta: number; quantity_after: number }
        Update: Partial<Database['public']['Tables']['stock_movements']['Row']>
        Relationships: []
      }
      film_rolls: {
        Row: {
          id: string
          shop_id: string
          name: string
          brand: string | null
          specification: string | null
          width_cm: string
          total_length_m: string
          remaining_length_m: string
          color_hex: string
          min_length_alert_m: string
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['film_rolls']['Row']> & { shop_id: string; name: string; width_cm: string; total_length_m: string; remaining_length_m: string }
        Update: Partial<Database['public']['Tables']['film_rolls']['Row']>
        Relationships: []
      }
      film_templates: {
        Row: {
          id: string
          shop_id: string | null
          car_type: string
          position: string
          length_m: string
          margin_m: string
        }
        Insert: Partial<Database['public']['Tables']['film_templates']['Row']> & { car_type: string; position: string; length_m: string }
        Update: Partial<Database['public']['Tables']['film_templates']['Row']>
        Relationships: []
      }
      film_cuts: {
        Row: {
          id: string
          shop_id: string
          film_roll_id: string
          job_id: string | null
          car_type: string
          positions: string[]
          length_used_m: string
          remaining_after_m: string
          cut_by: string | null
          cut_at: string
          notes: string | null
        }
        Insert: Partial<Database['public']['Tables']['film_cuts']['Row']> & { shop_id: string; film_roll_id: string; car_type: string; positions: string[]; length_used_m: string; remaining_after_m: string }
        Update: Partial<Database['public']['Tables']['film_cuts']['Row']>
        Relationships: []
      }
      insurance_claims: {
        Row: {
          id: string
          shop_id: string
          job_id: string | null
          claim_number: string
          insurance_company: string
          policy_number: string | null
          license_plate: string
          job_type: Database['public']['Enums']['job_type']
          claim_amount: string | null
          approved_amount: string | null
          status: Database['public']['Enums']['claim_status']
          notes: string | null
          submitted_at: string | null
          approved_at: string | null
          paid_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['insurance_claims']['Row']> & { shop_id: string; claim_number: string; insurance_company: string; license_plate: string; job_type: Database['public']['Enums']['job_type'] }
        Update: Partial<Database['public']['Tables']['insurance_claims']['Row']>
        Relationships: []
      }
      claim_documents: {
        Row: {
          id: string
          shop_id: string
          claim_id: string
          document_name: string
          is_submitted: boolean
          file_url: string | null
          submitted_at: string | null
          notes: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['claim_documents']['Row']> & { shop_id: string; claim_id: string; document_name: string }
        Update: Partial<Database['public']['Tables']['claim_documents']['Row']>
        Relationships: []
      }
      invoices: {
        Row: {
          id: string
          shop_id: string
          invoice_number: string
          job_id: string | null
          claim_id: string | null
          customer_id: string | null
          billed_to_name: string | null
          billed_to_phone: string | null
          license_plate: string | null
          subtotal: string
          vat_rate: string
          vat_amount: string
          total: string
          status: Database['public']['Enums']['invoice_status']
          paid_at: string | null
          paid_amount: string | null
          payment_method: string | null
          notes: string | null
          issued_by: string | null
          issued_at: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['invoices']['Row']> & { shop_id: string; invoice_number: string; vat_amount?: never; total?: never }
        Update: Partial<Database['public']['Tables']['invoices']['Row']> & { vat_amount?: never; total?: never }
        Relationships: []
      }
      invoice_items: {
        Row: {
          id: string
          shop_id: string
          invoice_id: string
          stock_item_id: string | null
          description: string
          quantity: string
          unit_price: string
          line_total: string
          sort_order: number
        }
        Insert: Partial<Database['public']['Tables']['invoice_items']['Row']> & { shop_id: string; invoice_id: string; description: string; unit_price: string; line_total?: never }
        Update: Partial<Database['public']['Tables']['invoice_items']['Row']> & { line_total?: never }
        Relationships: []
      }
      technician_capacity: {
        Row: {
          id: string
          shop_id: string
          technician_id: string
          work_date: string
          max_jobs: number
          is_available: boolean
        }
        Insert: Partial<Database['public']['Tables']['technician_capacity']['Row']> & { shop_id: string; technician_id: string }
        Update: Partial<Database['public']['Tables']['technician_capacity']['Row']>
        Relationships: []
      }
      job_assignments: {
        Row: {
          id: string
          shop_id: string
          job_id: string
          technician_id: string
          assigned_by: string | null
          due_date: string | null
          is_primary: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['job_assignments']['Row']> & { shop_id: string; job_id: string; technician_id: string }
        Update: Partial<Database['public']['Tables']['job_assignments']['Row']>
        Relationships: []
      }
      notification_logs: {
        Row: {
          id: string
          shop_id: string
          event: Database['public']['Enums']['notification_event']
          channel: Database['public']['Enums']['notification_channel']
          recipient: string
          payload: Record<string, unknown>
          status: 'pending' | 'sent' | 'failed'
          error_msg: string | null
          sent_at: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['notification_logs']['Row']> & { shop_id: string; event: Database['public']['Enums']['notification_event']; channel: Database['public']['Enums']['notification_channel']; recipient: string }
        Update: Partial<Database['public']['Tables']['notification_logs']['Row']>
        Relationships: []
      }
      notification_rules: {
        Row: {
          id: string
          shop_id: string
          event: Database['public']['Enums']['notification_event']
          channel: Database['public']['Enums']['notification_channel']
          is_enabled: boolean
          template: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['notification_rules']['Row']> & { shop_id: string; event: Database['public']['Enums']['notification_event']; channel: Database['public']['Enums']['notification_channel'] }
        Update: Partial<Database['public']['Tables']['notification_rules']['Row']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: 'owner' | 'manager' | 'technician' | 'accountant'
      job_status: 'quote' | 'pending' | 'in_progress' | 'waiting_parts' | 'claim' | 'done_waiting' | 'delivered' | 'cancelled'
      job_type: 'windshield_replace' | 'side_glass_replace' | 'rear_glass_replace' | 'film_tint' | 'crack_repair' | 'insurance_claim' | 'other'
      glass_position: 'front' | 'side_left' | 'side_right' | 'rear'
      stock_status: 'adequate' | 'low' | 'near_out' | 'out_of_stock'
      stock_category: 'glass' | 'film' | 'seal_rubber' | 'tool' | 'other'
      claim_status: 'waiting_docs' | 'in_progress' | 'approved' | 'rejected' | 'paid'
      invoice_status: 'draft' | 'pending_payment' | 'paid' | 'waiting_insurance' | 'cancelled'
      notification_channel: 'sms' | 'line' | 'in_app'
      notification_event: 'job_created' | 'job_status_changed' | 'job_completed' | 'claim_status_changed' | 'stock_low' | 'invoice_issued' | 'payment_received'
    }
  }
}
