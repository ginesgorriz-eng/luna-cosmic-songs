import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Ver nota en /api/admin/stats/route.ts — sin esto el CSV se congela
// en el primer build y no refleja registros nuevos.
export const dynamic = 'force-dynamic'
export const revalidate = 0

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, serviceKey)
}

export async function GET() {
  try {
    const supabase = getAdminSupabase()

    // Get all users
    const { data: usuarios } = await supabase
      .from('makinas')
      .select('*')
      .order('created_at', { ascending: false })

    // Get all sessions for minutes calculation
    const { data: sesiones } = await supabase
      .from('sesiones_juego')
      .select('makina_id, inicio, fin')

    const sesionesData = sesiones || []
    const usuariosData = usuarios || []

    // Calculate minutes per user
    const minutosPorUsuario: Record<string, number> = {}
    const sesionesPorUsuario: Record<string, number> = {}
    sesionesData.forEach((s: any) => {
      if (s.makina_id) {
        sesionesPorUsuario[s.makina_id] = (sesionesPorUsuario[s.makina_id] || 0) + 1
        if (s.inicio && s.fin) {
          const start = new Date(s.inicio).getTime()
          const end = new Date(s.fin).getTime()
          const minutes = Math.max(0, Math.round((end - start) / 60000))
          minutosPorUsuario[s.makina_id] = (minutosPorUsuario[s.makina_id] || 0) + minutes
        }
      }
    })

    // Build CSV
    const headers = ['Nombre', 'Email', 'Teléfono', 'Ciudad', 'País', 'Pronombre', 'Puntos', 'Minutos Jugados', 'Sesiones', 'Origen', 'Fecha Registro']
    const rows = usuariosData.map((u: any) => [
      (u.nombre || '').replace(/"/g, '""'),
      (u.email || '').replace(/"/g, '""'),
      (u.telefono || '').replace(/"/g, '""'),
      (u.ciudad || '').replace(/"/g, '""'),
      (u.pais || '').replace(/"/g, '""'),
      (u.pronombre || '').replace(/"/g, '""'),
      u.puntos_acumulados || 0,
      minutosPorUsuario[u.id] || 0,
      sesionesPorUsuario[u.id] || 0,
      (u.referrer_source || 'Direct').replace(/"/g, '""'),
      new Date(u.created_at).toISOString().split('T')[0],
    ])

    const csv = [
      headers.join(','),
      ...rows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(',')),
    ].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="makinas_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Error al exportar datos' }, { status: 500 })
  }
}
