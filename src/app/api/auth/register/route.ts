import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, nombre, pronombre, telefono, ciudad, pais, referrer_source } = body;

    if (!email || !password || !nombre || !pronombre || !telefono || !ciudad || !pais) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben estar completos.' },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabase();

    // 1. Create auth user with admin client (service role)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // auto-confirm email
    });

    if (authError) {
      console.error('Auth error:', authError);
      if (authError.message.includes('already') || authError.message.includes('duplicate')) {
        return NextResponse.json(
          { error: 'Este email ya está registrado. ¿Quieres iniciar sesión?' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Error creando el usuario.' },
        { status: 500 }
      );
    }

    // 2. Create makinas profile with service role (bypasses RLS)
    const { data: profile, error: dbError } = await supabase
      .from('makinas')
      .insert([
        {
          id: authData.user.id,
          email,
          nombre,
          pronombre,
          telefono,
          ciudad,
          pais,
          puntos_acumulados: 0,
          puntos_gastados: 0,
          referrer_source: referrer_source || null,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('DB error:', dbError);
      // Rollback: delete the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Error guardando el perfil. ' + dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: { id: authData.user.id, email },
      profile,
    });

  } catch (error: any) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
