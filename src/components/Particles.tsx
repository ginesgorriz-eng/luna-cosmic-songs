"use client";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  tx: number;
  fontSize: number;
  duration: number;
}

const EMOJIS = ['🌙', '❤️', '✨', '💜', '🩷', '⭐'];

export function useParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  const createParticles = useCallback((count: number = 20) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight * 0.7 : 500),
        tx: (Math.random() - 0.5) * 100,
        fontSize: Math.random() * 16 + 12,
        duration: 1.5 + Math.random(),
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 3000);
  }, []);

  return { particles, createParticles };
}

export default function Particles({ particles }: { particles: Particle[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: p.x, y: p.y, scale: 1 }}
            animate={{ opacity: 0, y: p.y - 100, x: p.x + p.tx, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: p.duration, ease: "easeOut" as const }}
            className="absolute text-lg"
            style={{ fontSize: p.fontSize }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
