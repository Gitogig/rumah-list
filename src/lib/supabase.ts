import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          role: 'buyer' | 'seller' | 'admin';
          verified: boolean | null;
          status: 'active' | 'suspended' | 'pending' | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          phone?: string | null;
          role?: 'buyer' | 'seller' | 'admin';
          verified?: boolean | null;
          status?: 'active' | 'suspended' | 'pending' | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string | null;
          role?: 'buyer' | 'seller' | 'admin';
          verified?: boolean | null;
          status?: 'active' | 'suspended' | 'pending' | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
  };
}