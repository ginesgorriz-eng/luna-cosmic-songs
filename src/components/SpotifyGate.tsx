"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface SpotifyGateProps {
  onUnlocked: () => void;
}

export default function SpotifyGate({ onUnlocked }: SpotifyGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleUnlock = useCallback(() => {
    if (!unlocked) {
      setUnlocked(true);
      setTimeout(() => onUnlocked(), 1500);
    }
  }, [unlocked, onUnlocked]);

  useEffect(() => {
    const handleBlur = () => {
      if (iframeRef.current && document.activeElement === iframeRef.current) {
        handleUnlock();
      }
    };

    window.addEventListener('blur', handleBlur);

    // Fallback interval
    const interval = setInterval(() => {
      if (iframeRef.current && document.activeElement === iframeRef.current) {
        handleUnlock();
      }
    }, 1000);

    return () => {
      window.removeEventListener('blur', handleBlur);
      clearInterval(interval);
    };
  }, [handleUnlock]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="glass rounded-2xl p-5 text-center max-w-lg mx-auto"
    >
      <p className="text-white/60 text-sm mb-3">Escucha CL34N. Dale al play de Spotify para poder jugar</p>
      <iframe
        ref={iframeRef}
        style={{ borderRadius: 12, width: '100%', maxWidth: 400, margin: '0 auto', display: 'block' }}
        src="https://open.spotify.com/embed/album/4mGvnfMaCkGXo1LHWjiOmD?utm_source=generator&theme=0"
        height={152}
        frameBorder={0}
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
      <div className="mt-3 text-sm font-medium min-h-[1.5rem]" style={{ color: unlocked ? '#22c55e' : 'transparent' }}>
        {unlocked ? '✓ Spotify conectado — ¡Adelante!' : ''}
      </div>
    </motion.div>
  );
}
