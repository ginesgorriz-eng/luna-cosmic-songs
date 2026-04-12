// Supabase client — will be configured when project is created
// For now, game data is hardcoded in canciones-data.ts

// TODO: Replace with actual Supabase credentials
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Database types (matching future Supabase schema)
export interface DBMakina {
  id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  created_at: string;
}

export interface DBPartida {
  id: string;
  makina_id: string;
  fase_actual: number;
  puntuacion: number;
  nivel: 'basico' | 'avanzado';
  canciones_completadas: string[]; // array of song IDs
  estado: 'en_curso' | 'completada' | 'abandonada';
  created_at: string;
  updated_at: string;
}

// Supabase client will be initialized here when credentials are available
// import { createClient } from '@supabase/supabase-js';
// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const isSupabaseConfigured = () => !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
