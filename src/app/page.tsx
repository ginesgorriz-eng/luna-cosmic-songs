"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Starfield from "@/components/Starfield";
import SpotifyGate from "@/components/SpotifyGate";
import LevelSelector from "@/components/LevelSelector";

export default function HomePage() {
  const router = useRouter();
  const [spotifyUnlocked, setSpotifyUnlocked] = useState(false);
  const [level, setLevel] = useState<"basico" | "avanzado">("basico");
  const [showSpotifyHint, setShowSpotifyHint] = useState(false);

  const handleStartJourney = () => {
    router.push(`/juego?level=${level}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <>
      <Starfield />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl w-full"
        >
          {/* Title */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-black mb-2">
              <span className="bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-white bg-clip-text text-transparent">
                Luna Cosmic Songs
              </span>
            </h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-cosmic-purple to-cosmic-pink rounded-full" />
          </motion.div>

          {/* Luna's Message */}
          <motion.div
            variants={itemVariants}
            className="glass rounded-2xl p-4 mb-6 max-w-lg mx-auto text-center"
          >
            <p className="text-white/60 text-xs leading-relaxed mb-2 italic">
              &ldquo;Ostia Makinas, tengo un problema gordo. Mandé mis canciones en la nave Artemis y por un fallo técnico las letras han quedado flotando por el espacio. Necesito vuestra ayuda para recomponerlas. ¿Os animáis?&rdquo;
            </p>
            <p className="text-cosmic-pink text-xs font-semibold">— Luna 🌙</p>
          </motion.div>

          {/* Spotify Embed */}
          <SpotifyGate onUnlocked={() => setSpotifyUnlocked(true)} />

          {/* Level Selector */}
          <LevelSelector level={level} onLevelChange={setLevel} />

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-3 mt-8 max-w-lg mx-auto"
          >
            <button
              onClick={spotifyUnlocked ? handleStartJourney : () => setShowSpotifyHint(true)}
              className="px-8 py-4 rounded-2xl font-bold text-lg transition-all cursor-pointer"
              style={
                spotifyUnlocked
                  ? { background: '#68A542', color: '#fff', boxShadow: '0 4px 16px rgba(104,165,66,0.4)', border: '1px solid #68A542' }
                  : { background: 'rgba(104,165,66,0.4)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(104,165,66,0.3)' }
              }
            >
              Comienza el Viaje Cósmico
            </button>
            {showSpotifyHint && !spotifyUnlocked && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-cosmic-pink text-sm font-medium text-center -mt-1"
              >
                Dale play a Spotify para empezar 🌙
              </motion.p>
            )}
            <div className="flex gap-2">
              <button
                onClick={spotifyUnlocked ? handleStartJourney : () => setShowSpotifyHint(true)}
                className="flex-1 px-3 py-2.5 rounded-2xl text-xs font-semibold text-white/70 border border-white/20 glass backdrop-blur-sm transition-all hover:text-white/90 hover:border-white/40"
              >
                Registrarme como Mákina
              </button>
              <button
                onClick={spotifyUnlocked ? handleStartJourney : () => setShowSpotifyHint(true)}
                className="flex-1 px-3 py-2.5 rounded-2xl text-xs font-semibold text-white/70 border border-white/20 glass backdrop-blur-sm transition-all hover:text-white/90 hover:border-white/40"
              >
                Ya soy Mákina registrada
              </button>
              <button
                onClick={spotifyUnlocked ? handleStartJourney : () => setShowSpotifyHint(true)}
                className="flex-1 px-3 py-2.5 rounded-2xl text-xs font-semibold text-white/40 border border-white/10 glass backdrop-blur-sm transition-all hover:text-white/60 hover:border-white/20"
              >
                Seguir sin registrar
              </button>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            variants={itemVariants}
            className="text-center text-white/40 text-sm mt-12"
          >
            Hecho con amor cósmico por Luna y sus Makinas 🌙
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}
