import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isSupabaseConfigured } from '@/lib/supabase'

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey);
}

export async function GET() {
  try {
    // If Supabase is not configured, return mock data
    if (!isSupabaseConfigured()) {
      return NextResponse.json(getMockData())
    }

    const supabase = getAdminSupabase()

    // Get all users
    const { data: usuarios } = await supabase
      .from('makinas')
      .select('*')
      .order('created_at', { ascending: false })

    const usuariosData = usuarios || []

    // Get today's users
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const usuariosHoy = usuariosData.filter((u: any) => {
      const createdAt = new Date(u.created_at)
      createdAt.setHours(0, 0, 0, 0)
      return createdAt.getTime() === today.getTime()
    }).length

    // Get game sessions
    const { data: sesiones } = await supabase
      .from('sesiones_juego')
      .select('*')
      .order('created_at', { ascending: false })

    const sesionesData = sesiones || []

    // Get today's sessions
    const sesionesHoy = sesionesData.filter((s: any) => {
      const fecha = new Date(s.created_at)
      fecha.setHours(0, 0, 0, 0)
      return fecha.getTime() === today.getTime()
    }).length

    // Calculate average minutes today
    const minutosHoy = sesionesData
      .filter((s: any) => {
        const fecha = new Date(s.created_at)
        fecha.setHours(0, 0, 0, 0)
        return fecha.getTime() === today.getTime()
      })
      .reduce((sum: number, s: any) => {
        // Calculate minutes from inicio and fin times
        if (s.inicio && s.fin) {
          const start = new Date(s.inicio).getTime()
          const end = new Date(s.fin).getTime()
          const minutes = Math.round((end - start) / 60000)
          return sum + Math.max(0, minutes)
        }
        return sum
      }, 0)

    const minutosPromedioHoy = sesionesHoy > 0 ? minutosHoy / sesionesHoy : 0

    // Users per day (last 30 days)
    const usuariosPorDia = getLastNDaysStats(usuariosData, 30, 'created_at', 'usuarios')

    // Sessions per day (last 30 days)
    const sesionesJuegoPorDia = getLastNDaysStats(sesionesData, 30, 'created_at', 'sesiones')

    // Minutes per day (last 30 days)
    const minutosJuegoPorDia = getLastNDaysStatsMinutes(sesionesData, 30)

    // Users by country
    const usuariosPorPais = groupByField(usuariosData, 'pais', 'Unknown Country')

    // Users by city (España)
    const usuariosPorCiudad = groupByFieldWithFilter(
      usuariosData,
      'ciudad',
      'pais',
      'España',
      'Unknown City'
    )

    // Users by traffic source
    const usuariosPorOrigen = groupByField(usuariosData, 'referrer_source', 'Direct')

    // Calculate minutes played per user
    const minutosPorUsuario: Record<string, number> = {}
    sesionesData.forEach((s: any) => {
      if (s.makina_id && s.inicio && s.fin) {
        const start = new Date(s.inicio).getTime()
        const end = new Date(s.fin).getTime()
        const minutes = Math.max(0, Math.round((end - start) / 60000))
        minutosPorUsuario[s.makina_id] = (minutosPorUsuario[s.makina_id] || 0) + minutes
      }
    })

    // Recent registrations (last 50) with minutes played
    const registrosRecientes = usuariosData.slice(0, 50).map((u: any) => ({
      id: u.id,
      nombre: u.nombre || 'N/A',
      email: u.email || 'N/A',
      telefono: u.telefono || null,
      ciudad: u.ciudad || null,
      pais: u.pais || null,
      fecha_registro: u.created_at,
      puntos_acumulados: u.puntos_acumulados || 0,
      minutos_jugados: minutosPorUsuario[u.id] || 0,
    }))

    return NextResponse.json({
      totalUsuarios: usuariosData.length,
      usuariosHoy,
      sesionesHoy,
      minutosPromedioHoy,
      usuariosPorDia,
      sesionesJuegoPorDia,
      minutosJuegoPorDia,
      usuariosPorPais,
      usuariosPorCiudad,
      usuariosPorOrigen,
      registrosRecientes,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(getMockData())
  }
}

function getMockData() {
  const today = new Date()
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (29 - i))
    return d.toISOString().split('T')[0]
  })

  return {
    totalUsuarios: 1247,
    usuariosHoy: 23,
    sesionesHoy: 87,
    minutosPromedioHoy: 12.5,
    usuariosPorDia: last30Days.map((fecha) => ({
      fecha,
      usuarios: Math.floor(Math.random() * 50) + 10,
    })),
    sesionesJuegoPorDia: last30Days.map((fecha) => ({
      fecha,
      sesiones: Math.floor(Math.random() * 150) + 30,
    })),
    minutosJuegoPorDia: last30Days.map((fecha) => ({
      fecha,
      minutos: Math.floor(Math.random() * 500) + 100,
    })),
    usuariosPorPais: [
      { pais: 'España', count: 850 },
      { pais: 'México', count: 180 },
      { pais: 'Argentina', count: 120 },
      { pais: 'Colombia', count: 97 },
    ],
    usuariosPorCiudad: [
      { ciudad: 'Madrid', count: 320 },
      { ciudad: 'Barcelona', count: 280 },
      { ciudad: 'Valencia', count: 150 },
      { ciudad: 'Bilbao', count: 100 },
    ],
    usuariosPorOrigen: [
      { origen: 'Direct', count: 650 },
      { origen: 'Instagram', count: 300 },
      { origen: 'Google', count: 200 },
      { origen: 'TikTok', count: 97 },
    ],
    registrosRecientes: Array.from({ length: 50 }, (_, i) => ({
      id: `user_${i}`,
      nombre: `Usuario ${i + 1}`,
      email: `user${i + 1}@example.com`,
      ciudad: ['Madrid', 'Barcelona', 'Valencia', 'Bilbao'][Math.floor(Math.random() * 4)],
      pais: 'España',
      fecha_registro: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      puntos_acumulados: Math.floor(Math.random() * 5000) + 100,
    })),
  }
}

function getLastNDaysStats(data: any[], days: number, dateField: string, metric: string) {
  const result: any[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const dayStart = date.getTime()
    const dayEnd = dayStart + 24 * 60 * 60 * 1000

    const count = data.filter((item) => {
      const itemDate = new Date(item[dateField]).getTime()
      return itemDate >= dayStart && itemDate < dayEnd
    }).length

    result.push({
      fecha: date.toISOString().split('T')[0],
      [metric]: count,
    })
  }

  return result
}

function getLastNDaysStatsMinutes(data: any[], days: number) {
  const result: any[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const dayStart = date.getTime()
    const dayEnd = dayStart + 24 * 60 * 60 * 1000

    const totalMinutos = data
      .filter((item) => {
        const itemDate = new Date(item.created_at).getTime()
        return itemDate >= dayStart && itemDate < dayEnd
      })
      .reduce((sum: number, item: any) => {
        // Calculate minutes from inicio and fin times
        if (item.inicio && item.fin) {
          const start = new Date(item.inicio).getTime()
          const end = new Date(item.fin).getTime()
          const minutes = Math.round((end - start) / 60000)
          return sum + Math.max(0, minutes)
        }
        return sum
      }, 0)

    result.push({
      fecha: date.toISOString().split('T')[0],
      minutos: totalMinutos,
    })
  }

  return result
}

function groupByField(data: any[], field: string, defaultValue: string) {
  const groups: { [key: string]: number } = {}

  data.forEach((item) => {
    const value = item[field] || defaultValue
    groups[value] = (groups[value] || 0) + 1
  })

  return Object.entries(groups)
    .map(([key, count]) => ({
      [field.replace('_', ' ')]: key,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

function groupByFieldWithFilter(
  data: any[],
  field: string,
  filterField: string,
  filterValue: string,
  defaultValue: string
) {
  const filtered = data.filter((item) => item[filterField] === filterValue)
  const groups: { [key: string]: number } = {}

  filtered.forEach((item) => {
    const value = item[field] || defaultValue
    groups[value] = (groups[value] || 0) + 1
  })

  return Object.entries(groups)
    .map(([key, count]) => ({
      [field]: key,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}
