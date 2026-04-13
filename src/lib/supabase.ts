import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Database types matching Supabase schema
export interface Makina {
  id: string;
  nombre: string;
  pronombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  pais: string;
  puntos_acumulados: number;
  puntos_gastados: number;
  referrer_source: string | null;
  created_at: string;
  updated_at: string;
}

export interface SesionJuego {
  id: string;
  makina_id: string | null;
  guest_fingerprint: string | null;
  inicio: string;
  fin: string | null;
  puntos_obtenidos: number;
  nivel: 'basico' | 'avanzado';
  fases_completadas: number;
  canciones_completadas: string[];
  referrer_source: string | null;
  user_agent: string | null;
  created_at: string;
}

// Supabase client singleton
let supabaseClient: SupabaseClient | null = null;

/**
 * Check if Supabase is configured with required environment variables
 */
export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!url && !!key;
};

/**
 * Get or initialize the Supabase client (lazy singleton pattern)
 */
export const getSupabase = (): SupabaseClient => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  supabaseClient = createClient(url, key);
  return supabaseClient;
};

// ============================================================================
// AUTH FUNCTIONS
// ============================================================================

/**
 * Register a new Makina with Supabase Auth and create profile
 */
export const registerMakina = async (
  email: string,
  password: string,
  profile: {
    nombre: string;
    pronombre: string;
    telefono: string;
    ciudad: string;
    pais: string;
    referrer_source?: string | null;
  }
) => {
  const supabase = getSupabase();

  try {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error('User creation failed');
    }

    // Create makinas profile entry
    const { data, error: dbError } = await supabase
      .from('makinas')
      .insert([
        {
          id: authData.user.id,
          email,
          nombre: profile.nombre,
          pronombre: profile.pronombre,
          telefono: profile.telefono,
          ciudad: profile.ciudad,
          pais: profile.pais,
          puntos_acumulados: 0,
          puntos_gastados: 0,
          referrer_source: profile.referrer_source || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    return { user: authData.user, profile: data };
  } catch (error) {
    console.error('Error registering Makina:', error);
    throw error;
  }
};

/**
 * Sign in a Makina with email and password
 */
export const loginMakina = async (email: string, password: string) => {
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error logging in Makina:', error);
    throw error;
  }
};

/**
 * Sign out current Makina
 */
export const logoutMakina = async () => {
  const supabase = getSupabase();

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

/**
 * Get current authenticated Makina and their profile
 */
export const getCurrentMakina = async (): Promise<{
  user: any;
  profile: Makina | null;
} | null> => {
  const supabase = getSupabase();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: profile, error } = await supabase
      .from('makinas')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      throw error;
    }

    return { user, profile };
  } catch (error) {
    console.error('Error getting current Makina:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string) => {
  const supabase = getSupabase();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Update Makina profile information
 */
export const updateMakinaProfile = async (
  id: string,
  updates: Partial<Makina>
) => {
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from('makinas')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating Makina profile:', error);
    throw error;
  }
};

// ============================================================================
// GAME SESSION FUNCTIONS
// ============================================================================

/**
 * Create a new game session
 */
export const startGameSession = async (
  makinaId: string | null,
  referrerSource: string | null,
  nivel: 'basico' | 'avanzado',
  guestFingerprint?: string | null
): Promise<string> => {
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from('sesiones_juego')
      .insert([
        {
          makina_id: makinaId,
          guest_fingerprint: guestFingerprint || null,
          inicio: new Date().toISOString(),
          puntos_obtenidos: 0,
          nivel,
          fases_completadas: 0,
          canciones_completadas: [],
          referrer_source: referrerSource,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
          created_at: new Date().toISOString(),
        },
      ])
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error('Error starting game session:', error);
    throw error;
  }
};

/**
 * End a game session and update stats
 */
export const endGameSession = async (
  sessionId: string,
  puntos: number,
  fasesCompletadas: number,
  cancionesCompletadas: string[]
) => {
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from('sesiones_juego')
      .update({
        fin: new Date().toISOString(),
        puntos_obtenidos: puntos,
        fases_completadas: fasesCompletadas,
        canciones_completadas: cancionesCompletadas,
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // If session is tied to a Makina, update their points
    if (data.makina_id) {
      await updateMakinaPoints(data.makina_id, puntos);
    }

    return data;
  } catch (error) {
    console.error('Error ending game session:', error);
    throw error;
  }
};

/**
 * Update a Makina's accumulated points (called when session ends)
 */
const updateMakinaPoints = async (makinaId: string, pointsEarned: number) => {
  const supabase = getSupabase();

  try {
    // Get current points
    const { data: makina, error: fetchError } = await supabase
      .from('makinas')
      .select('puntos_acumulados')
      .eq('id', makinaId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Update with new total
    const { error: updateError } = await supabase
      .from('makinas')
      .update({
        puntos_acumulados: (makina?.puntos_acumulados || 0) + pointsEarned,
        updated_at: new Date().toISOString(),
      })
      .eq('id', makinaId);

    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    console.error('Error updating Makina points:', error);
    throw error;
  }
};

/**
 * Get comprehensive stats for a Makina
 */
export const getMakinaStats = async (
  makinaId: string
): Promise<{
  profile: Makina | null;
  totalSessions: number;
  totalPoints: number;
  totalSongsCompleted: number;
  averagePointsPerSession: number;
  recentSessions: SesionJuego[];
}> => {
  const supabase = getSupabase();

  try {
    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('makinas')
      .select('*')
      .eq('id', makinaId)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Get all sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('sesiones_juego')
      .select('*')
      .eq('makina_id', makinaId)
      .order('created_at', { ascending: false });

    if (sessionsError) {
      throw sessionsError;
    }

    const completedSessions = sessions.filter((s) => s.fin !== null);
    const totalSessions = completedSessions.length;
    const totalPoints = profile?.puntos_acumulados || 0;

    // Count unique songs completed
    const uniqueSongs = new Set<string>();
    completedSessions.forEach((session) => {
      if (session.canciones_completadas) {
        session.canciones_completadas.forEach((song: string) => {
          uniqueSongs.add(song);
        });
      }
    });

    const averagePointsPerSession =
      totalSessions > 0 ? totalPoints / totalSessions : 0;

    return {
      profile,
      totalSessions,
      totalPoints,
      totalSongsCompleted: uniqueSongs.size,
      averagePointsPerSession,
      recentSessions: sessions.slice(0, 10) as SesionJuego[],
    };
  } catch (error) {
    console.error('Error getting Makina stats:', error);
    throw error;
  }
};
