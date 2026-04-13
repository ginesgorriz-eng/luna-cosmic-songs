import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceSupabase() {
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

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = getServiceSupabase();

    // 1. Create auth user via Supabase Admin REST API
    const createRes = await fetch(`${url}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
      }),
    });

    const createData = await createRes.json();

    if (!createRes.ok) {
      const errMsg = createData.msg || createData.message || createData.error || JSON.stringify(createData);
      if (errMsg.toLowerCase().includes('already') || errMsg.toLowerCase().includes('duplicate')) {
        return NextResponse.json(
          { error: 'Este email ya está registrado. ¿Quieres iniciar sesión?' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: errMsg }, { status: 400 });
    }

    const userId = createData.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'Error creando el usuario.' },
        { status: 500 }
      );
    }

    // 2. Create makinas profile with service role client (bypasses RLS)
    const { data: profile, error: dbError } = await supabase
      .from('makinas')
      .insert([
        {
          id: userId,
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
      // Rollback: delete the auth user via REST API
      await fetch(`${url}/auth/v1/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey,
        },
      });
      return NextResponse.json(
        { error: 'Error guardando el perfil. ' + dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: { id: userId, email },
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
