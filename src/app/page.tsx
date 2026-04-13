"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Starfield from "@/components/Starfield";
import LevelSelector from "@/components/LevelSelector";
import { useSpotify } from "@/contexts/SpotifyContext";

export default function HomePage() {
  const router = useRouter();
  const { spotifyUnlocked } = useSpotify();
  const [level, setLevel] = useState<"basico" | "avanzado">("basico");
  const [showSpotifyHint, setShowSpotifyHint] = useState(false);

  const handlePlay = (mode: "register" | "login" | "guest") => {
    if (!spotifyUnlocked) {
      setShowSpotifyHint(true);
      return;
    }
    if (mode === "register") {
      router.push("/registro");
    } else if (mode === "login") {
      router.push("/login");
    } else {
      router.push(`/juego?level=${level}`);
    }
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
          {/* Title — Luna Kosmic Songs */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-black mb-2">
              <span
                style={{
                  background: "linear-gradient(90deg, #68A542, #EAB3CB, #F5D547)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Luna Kosmic Songs
              </span>
            </h1>
            <div
              className="h-1 w-24 mx-auto rounded-full"
              style={{ background: "linear-gradient(90deg, #68A542, #EAB3CB, #F5D547)" }}
            />
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

          {/* Spotify hint — only before it's unlocked */}
          {!spotifyUnlocked && (
            <motion.div
              variants={itemVariants}
              className="text-center mb-4"
            >
              <p className="text-white/40 text-sm">
                Dale play al reproductor de Spotify para empezar 🌙
              </p>
            </motion.div>
          )}

          {/* Level Selector */}
          <LevelSelector level={level} onLevelChange={setLevel} />

          {/* Passive message — Comienza el Viaje Cósmico */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-6 mb-4 max-w-lg mx-auto"
          >
            <p
              className="text-lg font-bold italic"
              style={{
                background: "linear-gradient(90deg, #68A542, #EAB3CB, #F5D547)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                opacity: spotifyUnlocked ? 1 : 0.4,
              }}
            >
              Comienza el Viaje Cósmico
            </p>
          </motion.div>

          {/* Action Buttons — 3 keys */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-3 mt-2 max-w-lg mx-auto"
          >
            {showSpotifyHint && !spotifyUnlocked && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-cosmic-pink text-sm font-medium text-center"
              >
                Dale play a Spotify para empezar 🌙
              </motion.p>
            )}
            <div className="flex gap-2">
              {/* Registrarme como Mákina — #68A542 verde */}
              <button
                onClick={() => handlePlay("register")}
                className="flex-1 px-3 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer"
                style={{
                  background: spotifyUnlocked ? "rgba(104,165,66,0.25)" : "rgba(104,165,66,0.1)",
                  color: spotifyUnlocked ? "#68A542" : "rgba(104,165,66,0.4)",
                  border: `1px solid ${spotifyUnlocked ? "#68A542" : "rgba(104,165,66,0.2)"}`,
                }}
              >
                Registrarme como Mákina y jugar
              </button>
              {/* Ya soy Mákina — #EAB3CB rosa */}
              <button
                onClick={() => handlePlay("login")}
                className="flex-1 px-3 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer"
                style={{
                  background: spotifyUnlocked ? "rgba(234,179,203,0.25)" : "rgba(234,179,203,0.1)",
                  color: spotifyUnlocked ? "#EAB3CB" : "rgba(234,179,203,0.4)",
                  border: `1px solid ${spotifyUnlocked ? "#EAB3CB" : "rgba(234,179,203,0.2)"}`,
                }}
              >
                Ya soy Mákina registrada
              </button>
            </div>
            {/* Jugar sin registrar — #EAB3CB rosa, más pequeño */}
            <button
              onClick={() => handlePlay("guest")}
              className="px-3 py-2 rounded-2xl text-xs transition-all cursor-pointer mx-auto"
              style={{
                color: spotifyUnlocked ? "rgba(234,179,203,0.7)" : "rgba(234,179,203,0.3)",
                border: "none",
                background: "transparent",
              }}
            >
              Jugar sin registrar
              <span className="block text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                (no podrás acumular puntos ni guardar avances del juego)
              </span>
            </button>
          </motion.div>

          {/* Footer */}
          <motion.p
            variants={itemVariants}
            className="text-center text-white/40 text-sm mt-12"
          >
            Luna Kosmic Songs — Portal de Makinas
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}
