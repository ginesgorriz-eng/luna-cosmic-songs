'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface DashboardStats {
  totalUsuarios: number
  usuariosHoy: number
  sesionesHoy: number
  minutosPromedioHoy: number
  usuariosPorDia: Array<{ fecha: string; usuarios: number }>
  sesionesJuegoPorDia: Array<{ fecha: string; sesiones: number }>
  minutosJuegoPorDia: Array<{ fecha: string; minutos: number }>
  usuariosPorPais: Array<{ pais: string; count: number }>
  usuariosPorCiudad: Array<{ ciudad: string; count: number }>
  usuariosPorOrigen: Array<{ origen: string; count: number }>
  registrosRecientes: Array<{
    id: string
    nombre: string
    email: string
    ciudad: string
    pais: string
    fecha_registro: string
    puntos_acumulados: number
  }>
}

const COLORS = ['#68A542', '#EAB3CB', '#F5D547', '#8b5cf6', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      fetchStats()
    }, 60000)

    return () => clearInterval(interval)
  }, [isAuthenticated])

  // Fetch stats on authentication
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats()
    }
  }, [isAuthenticated])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        setPassword('')
      } else {
        setError('Contraseña incorrecta')
      }
    } catch (err) {
      setError('Error al verificar contraseña')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    setStatsLoading(true)
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        setError('Error al cargar estadísticas')
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setStatsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2e] to-[#0a0a1a] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-[#68A542] via-[#EAB3CB] to-[#F5D547] bg-clip-text text-transparent">
              Luna Ki Kosmik Songs
            </h1>
            <p className="text-center text-white/60 mb-8">Panel de Administración</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                  Contraseña de Admin
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#68A542] focus:border-transparent transition"
                />
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#68A542] to-[#5a8d38] hover:from-[#7ab350] hover:to-[#6a9d48] text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verificando...' : 'Acceder'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2e] to-[#0a0a1a] flex items-center justify-center p-4">
        <div className="text-white/60">
          {statsLoading ? 'Cargando estadísticas...' : 'Error al cargar datos'}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2e] to-[#0a0a1a] p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#68A542] via-[#EAB3CB] to-[#F5D547] bg-clip-text text-transparent">
            Luna Ki Kosmik Songs
          </h1>
          <p className="text-white/60 mt-2">Panel de Administración</p>
        </div>
        <button
          onClick={() => {
            setIsAuthenticated(false)
            setPassword('')
          }}
          className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 transition font-medium"
        >
          Cerrar sesión
        </button>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <KPICard
          title="Usuarios Registrados"
          value={stats.totalUsuarios}
          icon="👥"
          color="from-[#68A542]"
        />
        <KPICard
          title="Nuevos Usuarios Hoy"
          value={stats.usuariosHoy}
          icon="🆕"
          color="from-[#EAB3CB]"
        />
        <KPICard
          title="Sesiones Hoy"
          value={stats.sesionesHoy}
          icon="🎮"
          color="from-[#F5D547]"
        />
        <KPICard
          title="Min. Promedio/Sesión"
          value={Math.round(stats.minutosPromedioHoy)}
          icon="⏱️"
          color="from-[#8b5cf6]"
        />
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        {/* Usuarios por Día */}
        <ChartCard title="Nuevos Usuarios por Día">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.usuariosPorDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="fecha" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 26, 0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="usuarios"
                stroke="#68A542"
                strokeWidth={2}
                dot={{ fill: '#68A542' }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Sesiones por Día */}
        <ChartCard title="Sesiones de Juego por Día">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.sesionesJuegoPorDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="fecha" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 26, 0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="sesiones"
                stroke="#EAB3CB"
                strokeWidth={2}
                dot={{ fill: '#EAB3CB' }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Minutos por Día */}
        <ChartCard title="Minutos de Juego por Día">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.minutosJuegoPorDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="fecha" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 26, 0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="minutos" fill="#F5D547" radius={[8, 8, 0, 0]} isAnimationActive={true} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Usuarios por País */}
        <ChartCard title="Usuarios por País">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.usuariosPorPais}
                dataKey="count"
                nameKey="pais"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ pais, count }: any) => `${pais}: ${count}`}
                isAnimationActive={true}
              >
                {stats.usuariosPorPais.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 26, 0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Usuarios por Ciudad (España) */}
        <ChartCard title="Usuarios por Ciudad (España)">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.usuariosPorCiudad}
                dataKey="count"
                nameKey="ciudad"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ ciudad, count }: any) => `${ciudad}: ${count}`}
                isAnimationActive={true}
              >
                {stats.usuariosPorCiudad.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 26, 0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Origen del Tráfico */}
        <ChartCard title="Origen del Tráfico">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.usuariosPorOrigen}
                dataKey="count"
                nameKey="origen"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ origen, count }: any) => `${origen}: ${count}`}
                isAnimationActive={true}
              >
                {stats.usuariosPorOrigen.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 26, 0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      {/* Recent Registrations Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-2xl overflow-hidden">
          <h2 className="text-2xl font-bold text-white mb-6">Registros Recientes</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-4 py-3 text-left text-white/80 font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left text-white/80 font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-white/80 font-semibold">Ciudad</th>
                  <th className="px-4 py-3 text-left text-white/80 font-semibold">País</th>
                  <th className="px-4 py-3 text-left text-white/80 font-semibold">Fecha Registro</th>
                  <th className="px-4 py-3 text-right text-white/80 font-semibold">Puntos</th>
                </tr>
              </thead>
              <tbody>
                {stats.registrosRecientes.map((registro, idx) => (
                  <motion.tr
                    key={registro.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-3 text-white">{registro.nombre}</td>
                    <td className="px-4 py-3 text-white/70 truncate">{registro.email}</td>
                    <td className="px-4 py-3 text-white/70">{registro.ciudad || '-'}</td>
                    <td className="px-4 py-3 text-white/70">{registro.pais || '-'}</td>
                    <td className="px-4 py-3 text-white/70">
                      {new Date(registro.fecha_registro).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-4 py-3 text-right text-[#F5D547] font-semibold">
                      {registro.puntos_acumulados}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-white/60 text-sm">
            Mostrando {stats.registrosRecientes.length} registros recientes
          </div>
        </div>
      </motion.div>

      {/* Auto-refresh indicator */}
      <div className="mt-8 text-center text-white/40 text-sm">
        ⟲ Los datos se actualizan automáticamente cada 60 segundos
        {statsLoading && ' (cargando...)'}
      </div>
    </div>
  )
}

interface KPICardProps {
  title: string
  value: number
  icon: string
  color: string
}

function KPICard({ title, value, icon, color }: KPICardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition cursor-default`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/70 text-sm font-medium">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-4xl font-bold bg-gradient-to-r ${color} to-white/80 bg-clip-text text-transparent`}>
        {value.toLocaleString()}
      </p>
    </motion.div>
  )
}

interface ChartCardProps {
  title: string
  children: React.ReactNode
}

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      {children}
    </div>
  )
}
