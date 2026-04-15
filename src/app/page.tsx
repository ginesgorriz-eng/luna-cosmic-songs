"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { useSpotify } from "@/contexts/SpotifyContext";

export default function HomePage() {
  const router = useRouter();
  const { spotifyUnlocked, isMobile, markSpotifyClicked } = useSpotify();
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
      router.push("/juego");
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
      {/* Background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/bg-home.jpg')",
          filter: "brightness(0.35)",
        }}
      />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl w-full"
        >
          {/* Title — smaller */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-black mb-2">
              <span
                style={{
                  background: "linear-gradient(90deg, #68A542, #EAB3CB, #F5D547)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Luna Ki Misión lyrics
              </span>
            </h1>
            <div
              className="h-1 w-20 mx-auto rounded-full"
              style={{ background: "linear-gradient(90deg, #68A542, #EAB3CB, #F5D547)" }}
            />
          </motion.div>

          {/* Luna's Message */}
          <motion.div
            variants={itemVariants}
            className="glass rounded-2xl py-5 px-4 mb-8 max-w-md mx-auto text-center"
          >
            <p className="text-xs md:text-[11px] leading-relaxed italic" style={{ color: "#F1E9E4" }}>
              &ldquo;MÁKiNAS, tengo un problema desorbitado. Mandé mis canciones en la nave Artemis y por un fallo técnico las letras han quedado flotando por el espacio. Necesito vuestra ayuda para poder acabar el disco. ¿Os animáis?&rdquo;
            </p>
            <p className="text-cosmic-pink text-[11px] font-semibold mt-2">— Luna 🌙</p>
          </motion.div>

          {/* Spotify player — PC: iframe embed / Mobile: deep link to app */}
          <motion.div
            variants={itemVariants}
            className="max-w-md mx-auto"
          >
            {isMobile ? (
              <>
                <p className="text-xs text-center mb-3" style={{ color: "#68A542" }}>
                  Necesitas música para poder jugar. Dale al play
                </p>
                <div className="flex flex-col items-center gap-3">
                  <a
                    href="https://open.spotify.com/album/4mGvnfMaCkGXo1LHWjiOmD"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={markSpotifyClicked}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white text-sm font-semibold transition-transform active:scale-95"
                    style={{ background: "#1DB954" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    Abrir en Spotify
                  </a>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-center mb-1" style={{ color: "#68A542" }}>
                  Necesitas música para poder jugar. Dale al play
                </p>
                <div id="spotify-portal-target" style={{ minHeight: 152 }} />
              </>
            )}
          </motion.div>

          {/* Action Buttons — 3 in a row */}
          <motion.div
            variants={itemVariants}
            className="max-w-lg mx-auto mt-12"
          >
            {spotifyUnlocked && (
              <p className="text-center mb-3 text-xs font-semibold" style={{ color: "#EAB3CB" }}>
                Spotify conectado. Comienza el viaje cósmico
              </p>
            )}
            {showSpotifyHint && !spotifyUnlocked && (
              <p className="text-xs font-medium text-center mb-2" style={{ color: "#EAB3CB" }}>
                Dale play a Spotify para empezar 🌙
              </p>
            )}
            <div className="flex gap-2" style={{ opacity: spotifyUnlocked ? 1 : 0.6, transition: "opacity 0.4s ease" }}>
              {/* Registrarme — #68A542 verde */}
              <button
                onClick={() => handlePlay("register")}
                className="flex-1 px-2 py-2.5 rounded-lg text-center transition-all cursor-pointer"
                style={{ background: "#68A542", color: "#fff", boxShadow: "none" }}
              >
                <span className="block text-[11px] font-bold leading-tight">Registrarme como Mákina</span>
                <span className="block text-[9px] mt-0.5" style={{ opacity: 0.7 }}>y jugar</span>
              </button>
              {/* Ya soy Mákina — #8FCBE4 azul */}
              <button
                onClick={() => handlePlay("login")}
                className="flex-1 px-2 py-2.5 rounded-lg text-center transition-all cursor-pointer"
                style={{ background: "#8FCBE4", color: "#1a1a2e", boxShadow: "none" }}
              >
                <span className="block text-[11px] font-bold leading-tight">Ya soy Mákina</span>
                <span className="block text-[9px] mt-0.5" style={{ opacity: 0.7 }}>registrada</span>
              </button>
              {/* Jugar sin registrar — #FABF06 amarillo */}
              <button
                onClick={() => handlePlay("guest")}
                className="flex-1 px-2 py-2.5 rounded-lg text-center transition-all cursor-pointer"
                style={{ background: "#FABF06", color: "#1a1a2e", boxShadow: "none" }}
              >
                <span className="block text-[10px] font-semibold leading-tight">Jugar sin registrar</span>
                <span className="block text-[8px] mt-0.5" style={{ opacity: 0.7 }}>sin puntos ni avances</span>
              </button>
            </div>
          </motion.div>

          {/* Spacer before global footer */}
          <div className="mt-8" />
        </motion.div>
      </div>
    </>
  );
}
