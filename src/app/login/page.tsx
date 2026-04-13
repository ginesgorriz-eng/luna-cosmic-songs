'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Starfield from '@/components/Starfield';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function LoginPage() {
  const router = useRouter();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Password reset state
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Error al iniciar sesión.');
      } else {
        router.push('/juego?level=basico');
      }
    } catch (error) {
      setLoginError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');
    setResetLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResetError(data.error || 'Error al solicitar restablecimiento.');
      } else {
        setResetMessage(
          'Se ha enviado un enlace de restablecimiento de contraseña a tu correo.'
        );
        setResetEmail('');
      }
    } catch (error) {
      setResetError('Error de conexión. Intenta de nuevo.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      {/* Starfield background */}
      <Starfield />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Title */}
          <motion.div variants={itemVariants} className="text-center mb-5">
            <h1
              className="text-2xl md:text-3xl font-black mb-1"
              style={{
                background: "linear-gradient(90deg, #68A542, #EAB3CB, #F5D547)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Luna Ki misión lyrics
            </h1>
          </motion.div>

          {/* Glass morphism card */}
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-[12px] bg-white/6 border border-white/10 rounded-2xl p-5 shadow-2xl"
          >
            {/* Subtitle */}
            <motion.h2
              variants={itemVariants}
              className="text-sm text-white/80 text-center mb-5 font-light"
            >
              Bienvenida de vuelta, Mákina
            </motion.h2>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 mb-5">
              {/* Email Input */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-white/70 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#EAB3CB]/50 focus:bg-white/8 transition-all duration-200"
                />
              </motion.div>

              {/* Password Input */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-white/70 mb-1"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#EAB3CB]/50 focus:bg-white/8 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
                    aria-label={
                      showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Error Message */}
              {loginError && (
                <motion.div
                  variants={itemVariants}
                  className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-[11px]"
                >
                  {loginError}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loginLoading}
                className="w-full px-4 py-2.5 bg-[#EAB3CB] hover:bg-[#f5c7db] disabled:bg-[#EAB3CB]/50 disabled:cursor-not-allowed text-[#0a0a1a] text-xs font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-[#EAB3CB]/20 hover:shadow-xl"
              >
                {loginLoading ? 'Entrando...' : 'Entrar al Makina\'s Club'}
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
            </motion.div>

            {/* Password Reset Section */}
            <motion.div variants={itemVariants} className="space-y-2">
              {!showResetForm ? (
                <button
                  type="button"
                  onClick={() => setShowResetForm(true)}
                  className="w-full text-[11px] text-[#EAB3CB] hover:text-[#f5c7db] transition-colors text-center"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              ) : (
                <motion.form
                  onSubmit={handlePasswordReset}
                  className="space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#EAB3CB]/50 focus:bg-white/8 transition-all duration-200 text-xs"
                  />

                  {resetError && (
                    <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-[10px]">
                      {resetError}
                    </div>
                  )}

                  {resetMessage && (
                    <div className="p-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-[10px]">
                      {resetMessage}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 px-3 py-1.5 bg-[#EAB3CB]/20 hover:bg-[#EAB3CB]/30 disabled:bg-[#EAB3CB]/10 disabled:cursor-not-allowed text-[#EAB3CB] text-[11px] font-medium rounded-lg transition-colors"
                    >
                      {resetLoading ? 'Enviando...' : 'Enviar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowResetForm(false);
                        setResetEmail('');
                        setResetMessage('');
                        setResetError('');
                      }}
                      className="flex-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 text-[11px] font-medium rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.form>
              )}
            </motion.div>
          </motion.div>

          {/* Links */}
          <motion.div
            variants={itemVariants}
            className="mt-5 text-center space-y-2"
          >
            <div>
              <Link
                href="/registro"
                className="text-white/60 hover:text-[#EAB3CB] transition-colors text-[11px]"
              >
                ¿No tienes cuenta?{' '}
                <span className="font-semibold text-[#EAB3CB]">Regístrate</span>
              </Link>
            </div>
            <div>
              <Link
                href="/"
                className="text-white/40 hover:text-white/60 transition-colors text-[11px]"
              >
                Volver al inicio
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
