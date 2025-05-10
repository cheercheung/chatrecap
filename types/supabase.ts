export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          nickname: string | null
          avatar_url: string | null
          credits: number
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          nickname?: string | null
          avatar_url?: string | null
          credits?: number
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          nickname?: string | null
          avatar_url?: string | null
          credits?: number
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          amount: number
          status: string
          created_at: string
          updated_at: string
          payment_id: string | null
          credit_amount: number
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          status?: string
          created_at?: string
          updated_at?: string
          payment_id?: string | null
          credit_amount: number
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          status?: string
          created_at?: string
          updated_at?: string
          payment_id?: string | null
          credit_amount?: number
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: string
          description: string | null
          reference_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: string
          description?: string | null
          reference_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: string
          description?: string | null
          reference_id?: string | null
          created_at?: string
        }
      }
      chat_files: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          file_type: string
          status: string
          created_at: string
          words_count: number | null
          storage_path: string | null
          basic_result_path: string | null
          ai_result_path: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          file_type: string
          status?: string
          created_at?: string
          words_count?: number | null
          storage_path?: string | null
          basic_result_path?: string | null
          ai_result_path?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          file_type?: string
          status?: string
          created_at?: string
          words_count?: number | null
          storage_path?: string | null
          basic_result_path?: string | null
          ai_result_path?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      process_completed_order: {
        Args: {
          order_id: string
          payment_status: string
          payment_amount: number
        }
        Returns: boolean
      }
      create_analysis_task: {
        Args: {
          user_id: string
          file_id: string
          credits_required: number
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
