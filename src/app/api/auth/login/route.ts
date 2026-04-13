import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son obligatorios.' },
        { status: 400 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const anonSupabase = createClient(url, anonKey);

    // Try normal login first
    const { data, error } = await anonSupabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // If email not confirmed, auto-confirm via REST API and retry
      if (error.message.toLowerCase().includes('email not confirmed')) {
        try {
          // List users to find this one — use Supabase Admin REST API
          const listRes = await fetch(`${url}/auth/v1/admin/users?page=1&per_page=50`, {
            headers: {
              'Authorization': `Bearer ${serviceKey}`,
              'apikey': serviceKey,
            },
          });

          if (listRes.ok) {
            const listData = await listRes.json();
            const users = listData.users || listData;
            const user = Array.isArray(users)
              ? users.find((u: any) => u.email === email)
              : null;

            if (user) {
              // Confirm the email via admin API
              const updateRes = await fetch(`${url}/auth/v1/admin/users/${user.id}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${serviceKey}`,
                  'apikey': serviceKey,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email_confirm: true }),
              });

              if (updateRes.ok) {
                // Retry login
                const { data: retryData, error: retryError } =
                  await anonSupabase.auth.signInWithPassword({ email, password });

                if (retryError) {
                  return NextResponse.json(
                    { error: retryError.message },
                    { status: 401 }
                  );
                }

                return NextResponse.json({
                  success: true,
                  session: retryData.session,
                  user: retryData.user,
                });
              }
            }
          }
        } catch (adminError) {
          console.error('Admin confirm error:', adminError);
        }

        // If auto-confirm failed, return the original error
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      session: data.session,
      user: data.user,
    });
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
