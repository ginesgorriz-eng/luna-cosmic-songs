'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Starfield from '@/components/Starfield';

interface FormData {
  nombre: string;
  pronombre: string;
  email: string;
  password: string;
  passwordConfirm: string;
  telefono: string;
  ciudad: string;
  pais: string;
}

interface FormErrors {
  [key: string]: string;
}

const countries = [
  'España',
  'México',
  'Argentina',
  'Colombia',
  'Perú',
  'Chile',
  'Ecuador',
  'Bolivia',
  'Uruguay',
  'Paraguay',
  'Costa Rica',
  'Guatemala',
  'El Salvador',
  'Honduras',
  'Nicaragua',
  'Panamá',
  'Cuba',
  'República Dominicana',
  'Puerto Rico',
  'Otros'
];

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    pronombre: '',
    email: '',
    password: '',
    passwordConfirm: '',
    telefono: '',
    ciudad: '',
    pais: 'España'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [referrerSource, setReferrerSource] = useState('direct');

  useEffect(() => {
    // Detect referrer source
    if (typeof document !== 'undefined') {
      const referrer = document.referrer;
      if (referrer.includes('twitter.com') || referrer.includes('x.com')) {
        setReferrerSource('twitter');
      } else if (referrer.includes('instagram.com')) {
        setReferrerSource('instagram');
      } else if (referrer.includes('facebook.com')) {
        setReferrerSource('facebook');
      } else if (referrer.includes('tiktok.com')) {
        setReferrerSource('tiktok');
      } else if (referrer) {
        setReferrerSource('other');
      } else {
        setReferrerSource('direct');
      }
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.pronombre) {
      newErrors.pronombre = 'Debes seleccionar un pronombre preferido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Por favor ingresa un email válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Las contraseñas no coinciden';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es requerida';
    }

    if (!formData.pais) {
      newErrors.pais = 'El país es requerido';
    }

    if (!legalAccepted) {
      newErrors.legal = 'Debes aceptar la Política de Privacidad y los Términos y Condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nombre: formData.nombre,
          pronombre: formData.pronombre,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          pais: formData.pais,
          referrer_source: referrerSource,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ submit: data.error || 'Error durante el registro.' });
        setLoading(false);
        return;
      }

      // Success
      setSuccessMessage('¡Bienvenida al Makina\'s Club! Redirigiendo...');
      setTimeout(() => {
        router.push('/juego?level=basico');
      }, 1500);
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Error de conexión. Por favor intenta de nuevo.' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0a0a1a' }}>
      <Starfield />

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Logo/Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1
              className="text-4xl sm:text-5xl font-bold mb-2"
              style={{
                backgroundImage: 'linear-gradient(90deg, #68A542, #EAB3CB, #F5D547)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Luna Ki Kosmik Songs
            </h1>
          </motion.div>

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 p-4 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <p className="text-white text-center text-sm leading-relaxed">
              Hola Mákina, a partir de ahora serás miembro oficial del Makina's Club de Luna.
              Recibirás información exclusiva, invitaciones a eventos privados, avisos de
              conciertos y eventos en tu zona, lanzamientos y mucho más.
            </p>
          </motion.div>

          {/* Registration Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 p-6 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Error Message */}
            {errors.submit && (
              <div className="p-3 rounded bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                {errors.submit}
              </div>
            )}

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-white text-sm font-medium mb-2">
                Nombre *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={loading}
                placeholder="Tu nombre completo"
                className="w-full px-4 py-2 rounded-lg text-white placeholder-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              />
              {errors.nombre && (
                <p className="text-red-400 text-xs mt-1">{errors.nombre}</p>
              )}
            </div>

            {/* Pronombre */}
            <div>
              <label htmlFor="pronombre" className="block text-white text-sm font-medium mb-2">
                Pronombre preferido *
              </label>
              <select
                id="pronombre"
                name="pronombre"
                value={formData.pronombre}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <option value="" style={{ background: '#1a1a2e', color: '#ccc' }}>Selecciona un pronombre</option>
                <option value="ella" style={{ background: '#1a1a2e', color: '#fff' }}>ella/ellas</option>
                <option value="el" style={{ background: '#1a1a2e', color: '#fff' }}>él/ellos</option>
                <option value="elle" style={{ background: '#1a1a2e', color: '#fff' }}>elle/elles</option>
                <option value="otro" style={{ background: '#1a1a2e', color: '#fff' }}>otro</option>
              </select>
              {errors.pronombre && (
                <p className="text-red-400 text-xs mt-1">{errors.pronombre}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                placeholder="tu@email.com"
                className="w-full px-4 py-2 rounded-lg text-white placeholder-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                Contraseña *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2 rounded-lg text-white placeholder-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Repetir Contraseña */}
            <div>
              <label htmlFor="passwordConfirm" className="block text-white text-sm font-medium mb-2">
                Repetir contraseña *
              </label>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                disabled={loading}
                placeholder="Repite tu contraseña"
                className="w-full px-4 py-2 rounded-lg text-white placeholder-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              />
              {errors.passwordConfirm && (
                <p className="text-red-400 text-xs mt-1">{errors.passwordConfirm}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-white text-sm font-medium mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                disabled={loading}
                placeholder="+34 600 000 000"
                className="w-full px-4 py-2 rounded-lg text-white placeholder-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              />
              {errors.telefono && (
                <p className="text-red-400 text-xs mt-1">{errors.telefono}</p>
              )}
            </div>

            {/* Ciudad */}
            <div>
              <label htmlFor="ciudad" className="block text-white text-sm font-medium mb-2">
                Ciudad *
              </label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                disabled={loading}
                placeholder="Tu ciudad"
                className="w-full px-4 py-2 rounded-lg text-white placeholder-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              />
              {errors.ciudad && (
                <p className="text-red-400 text-xs mt-1">{errors.ciudad}</p>
              )}
            </div>

            {/* País */}
            <div>
              <label htmlFor="pais" className="block text-white text-sm font-medium mb-2">
                País *
              </label>
              <select
                id="pais"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                {countries.map(country => (
                  <option key={country} value={country} style={{ background: '#1a1a2e', color: '#fff' }}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.pais && (
                <p className="text-red-400 text-xs mt-1">{errors.pais}</p>
              )}
            </div>

            {/* Legal Acceptance */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-4 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={legalAccepted}
                  onChange={(e) => {
                    setLegalAccepted(e.target.checked);
                    if (e.target.checked && errors.legal) {
                      setErrors(prev => ({
                        ...prev,
                        legal: ''
                      }));
                    }
                  }}
                  disabled={loading}
                  className="mt-1 w-4 h-4 rounded cursor-pointer accent-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-white text-xs leading-relaxed">
                  He leído y acepto la Política de Privacidad y los Términos y Condiciones.
                  Autorizo el tratamiento de mis datos personales para la gestión de mi cuenta
                  y el envío de comunicaciones relacionadas con Luna Ki y el Makina's Club.
                </span>
              </label>
              {errors.legal && (
                <p className="text-red-400 text-xs mt-2">{errors.legal}</p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 rounded-lg font-semibold text-white transition disabled:opacity-70 disabled:cursor-not-allowed mt-6"
              style={{
                background: loading ? 'rgba(104, 165, 66, 0.6)' : '#68A542',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Registrando...' : 'Unirme al Makina\'s Club'}
            </motion.button>
          </motion.form>

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-lg text-center text-green-400 mt-4"
              style={{
                background: 'rgba(104, 165, 66, 0.2)',
                border: '1px solid rgba(104, 165, 66, 0.5)'
              }}
            >
              {successMessage}
            </motion.div>
          )}

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center space-y-3 mt-6"
          >
            <p className="text-gray-300 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-transparent bg-clip-text" style={{
                backgroundImage: 'linear-gradient(90deg, #68A542, #EAB3CB)'
              }}>
                Inicia sesión
              </Link>
            </p>
            <p>
              <Link href="/" className="text-gray-400 hover:text-gray-200 text-sm transition">
                Volver al inicio
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
