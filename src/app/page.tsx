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
          {/* Title — smaller */}
          <motion.div variants={itemVariants} className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-black mb-2">
              <span
                style={{
                  background: "linear-gradient(90deg, #68A542, #EAB3CB, #F5D547)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Luna Ki Kosmik Songs
              </span>
            </h1>
            <div
              className="h-1 w-20 mx-auto rounded-full"
              style={{ background: "linear-gradient(90deg, #68A542, #EAB3CB, #F5D547)" }}
            />
          </motion.div>

          {/* Luna's Message — smaller, italic */}
          <motion.div
            variants={itemVariants}
            className="glass rounded-2xl p-3 mb-5 max-w-md mx-auto text-center"
          >
            <p className="text-white/50 text-[11px] leading-relaxed italic">
              &ldquo;Ostia Makinas, tengo un problema gordo. Mandé mis canciones en la nave Artemis y por un fallo técnico las letras han quedado flotando por el espacio. Necesito vuestra ayuda para recomponerlas. ¿Os animáis?&rdquo;
            </p>
            <p className="text-cosmic-pink text-[11px] font-semibold mt-1">— Luna 🌙</p>
          </motion.div>

          {/* Spotify — the iframe is rendered by SpotifyProvider as a fixed overlay on home.
              We just reserve the space here + show text around it. */}
          <motion.div
            variants={itemVariants}
            className="max-w-md mx-auto mb-5"
          >
            <p className="text-white/40 text-xs text-center mb-2">
              Escucha CL34N. Dale al play para poder jugar
            </p>
            {/* Space for the fixed-positioned iframe from SpotifyProvider */}
            <div style={{ height: 152 }} />
            {spotifyUnlocked && (
              <p className="text-center mt-2" style={{ color: "#68A542", fontSize: 12, fontWeight: 600 }}>
                ✓ Spotify conectado — ¡Adelante!
              </p>
            )}
          </motion.div>

          {/* Level Selector — two pills side by side */}
          <motion.div
            variants={itemVariants}
            className="flex gap-3 max-w-sm mx-auto mb-5"
          >
            <button
              onClick={() => setLevel("basico")}
              className="flex-1 px-3 py-2.5 rounded-lg text-center transition-all cursor-pointer"
              style={
                level === "basico"
                  ? { background: "#EAB3CB", color: "#1a1a2e", boxShadow: "none" }
                  : { background: "#1a1a2e", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(234,179,203,0.3)" }
              }
            >
              <span className="block text-xs font-semibold">Nivel Fácil</span>
              <span className="block text-[10px] italic mt-0.5" style={{ opacity: 0.65 }}>8 líneas</span>
            </button>
            <button
              onClick={() => setLevel("avanzado")}
              className="flex-1 px-3 py-2.5 rounded-lg text-center transition-all cursor-pointer"
              style={
                level === "avanzado"
                  ? { background: "#F5D547", color: "#1a1a2e", boxShadow: "none" }
                  : { background: "#1a1a2e", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(245,213,71,0.3)" }
              }
            >
              <span className="block text-xs font-semibold">Nivel SuperMákina</span>
              <span className="block text-[10px] italic mt-0.5" style={{ opacity: 0.65 }}>canción entera</span>
            </button>
          </motion.div>

          {/* Passive message — Comienza el Viaje Cósmico */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-3 max-w-lg mx-auto"
          >
            <p
              className="text-sm font-bold italic"
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

          {/* Action Buttons — 3 in a row */}
          <motion.div
            variants={itemVariants}
            className="max-w-lg mx-auto"
          >
            {showSpotifyHint && !spotifyUnlocked && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-cosmic-pink text-xs font-medium text-center mb-2"
              >
                Dale play a Spotify para empezar 🌙
              </motion.p>
            )}
            <div className="flex gap-2">
              {/* Registrarme — #68A542 verde */}
              <button
                onClick={() => handlePlay("register")}
                className="flex-1 px-2 py-2.5 rounded-lg text-center transition-all cursor-pointer"
                style={{
                  background: spotifyUnlocked ? "#68A542" : "#1a1a2e",
                  color: spotifyUnlocked ? "#fff" : "rgba(104,165,66,0.4)",
                  border: spotifyUnlocked ? "none" : "1px solid rgba(104,165,66,0.2)",
                  boxShadow: "none",
                }}
              >
                <span className="block text-[11px] font-bold leading-tight">Registrarme como Mákina</span>
                <span className="block text-[9px] mt-0.5" style={{ opacity: 0.7 }}>y jugar</span>
              </button>
              {/* Ya soy Mákina — #8FCBE4 azul */}
              <button
                onClick={() => handlePlay("login")}
                className="flex-1 px-2 py-2.5 rounded-lg text-center transition-all cursor-pointer"
                style={{
                  background: spotifyUnlocked ? "#8FCBE4" : "#1a1a2e",
                  color: spotifyUnlocked ? "#1a1a2e" : "rgba(143,203,228,0.4)",
                  border: spotifyUnlocked ? "none" : "1px solid rgba(143,203,228,0.2)",
                  boxShadow: "none",
                }}
              >
                <span className="block text-[11px] font-bold leading-tight">Ya soy Mákina</span>
                <span className="block text-[9px] mt-0.5" style={{ opacity: 0.7 }}>registrada</span>
              </button>
              {/* Jugar sin registrar — #FABF06 amarillo */}
              <button
                onClick={() => handlePlay("guest")}
                className="flex-1 px-2 py-2.5 rounded-lg text-center transition-all cursor-pointer"
                style={{
                  background: spotifyUnlocked ? "#FABF06" : "#1a1a2e",
                  color: spotifyUnlocked ? "#1a1a2e" : "rgba(250,191,6,0.4)",
                  border: spotifyUnlocked ? "none" : "1px solid rgba(250,191,6,0.2)",
                  boxShadow: "none",
                }}
              >
                <span className="block text-[10px] font-semibold leading-tight">Jugar sin registrar</span>
                <span className="block text-[8px] mt-0.5" style={{ opacity: 0.7 }}>sin puntos ni avances</span>
              </button>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            variants={itemVariants}
            className="text-center text-white/40 text-xs mt-8"
          >
            Luna Ki Kosmik Songs — Portal de Makinas
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}
