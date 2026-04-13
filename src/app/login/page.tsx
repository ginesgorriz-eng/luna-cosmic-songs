'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Starfield from '@/components/Starfield';
import { loginMakina, resetPassword } from '@/lib/supabase';

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
      await loginMakina(email, password);
      router.push('/juego?level=basico');
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : 'Error al iniciar sesión. Intenta de nuevo.'
      );
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
      await resetPassword(resetEmail);
      setResetMessage(
        'Se ha enviado un enlace de restablecimiento de contraseña a tu correo.'
      );
      setResetEmail('');
    } catch (error) {
      setResetError(
        error instanceof Error
          ? error.message
          : 'Error al solicitar restablecimiento. Intenta de nuevo.'
      );
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
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-[#68A542] via-[#EAB3CB] to-[#F5D547] bg-clip-text text-transparent">
              Luna Kosmic Songs
            </h1>
          </motion.div>

          {/* Glass morphism card */}
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-[12px] bg-white/6 border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            {/* Subtitle */}
            <motion.h2
              variants={itemVariants}
              className="text-xl text-white/80 text-center mb-8 font-light"
            >
              Bienvenida de vuelta, Mákina
            </motion.h2>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6 mb-8">
              {/* Email Input */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white/70 mb-2"
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#EAB3CB]/50 focus:bg-white/8 transition-all duration-200"
                />
              </motion.div>

              {/* Password Input */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white/70 mb-2"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#EAB3CB]/50 focus:bg-white/8 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
                    aria-label={
                      showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Error Message */}
              {loginError && (
                <motion.div
                  variants={itemVariants}
                  className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                >
                  {loginError}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loginLoading}
                className="w-full px-6 py-3 bg-[#EAB3CB] hover:bg-[#f5c7db] disabled:bg-[#EAB3CB]/50 disabled:cursor-not-allowed text-[#0a0a1a] font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-[#EAB3CB]/20 hover:shadow-xl"
              >
                {loginLoading ? 'Entrando...' : 'Entrar al Makina\'s Club'}
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
            </motion.div>

            {/* Password Reset Section */}
            <motion.div variants={itemVariants} className="space-y-3">
              {!showResetForm ? (
                <button
                  type="button"
                  onClick={() => setShowResetForm(true)}
                  className="w-full text-sm text-[#EAB3CB] hover:text-[#f5c7db] transition-colors text-center"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              ) : (
                <motion.form
                  onSubmit={handlePasswordReset}
                  className="space-y-3"
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
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#EAB3CB]/50 focus:bg-white/8 transition-all duration-200 text-sm"
                  />

                  {resetError && (
                    <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
                      {resetError}
                    </div>
                  )}

                  {resetMessage && (
                    <div className="p-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-xs">
                      {resetMessage}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 px-3 py-2 bg-[#EAB3CB]/20 hover:bg-[#EAB3CB]/30 disabled:bg-[#EAB3CB]/10 disabled:cursor-not-allowed text-[#EAB3CB] text-sm font-medium rounded-lg transition-colors"
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
                      className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 text-sm font-medium rounded-lg transition-colors"
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
            className="mt-8 text-center space-y-3"
          >
            <div>
              <Link
                href="/registro"
                className="text-white/60 hover:text-[#EAB3CB] transition-colors text-sm"
              >
                ¿No tienes cuenta?{' '}
                <span className="font-semibold text-[#EAB3CB]">Regístrate</span>
              </Link>
            </div>
            <div>
              <Link
                href="/"
                className="text-white/40 hover:text-white/60 transition-colors text-sm"
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
