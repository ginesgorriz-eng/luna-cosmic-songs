"use client";
import { motion } from "framer-motion";

interface ScoreBarProps {
  score: number;
  phase: number;
  totalPhases: number;
  level: 'basico' | 'avanzado';
}

export default function ScoreBar({ score, phase, totalPhases, level }: ScoreBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-4 py-3 rounded-xl mb-3"
      style={{
        background: 'rgba(20,10,40,.85)',
        animation: 'glowPulse 4s ease-in-out infinite',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl font-black text-cosmic-purple" style={{ textShadow: '0 0 10px rgba(139,92,246,.5)' }}>
          {score}
        </span>
        <span className="text-sm text-white/80">pts</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-white">
        <span>Fase <strong className="text-cosmic-pink">{phase}</strong>/{totalPhases}</span>
        <span className="text-white/40">|</span>
        <span className="text-xs px-2 py-1 rounded-md" style={{
          background: level === 'basico' ? 'rgba(139,92,246,.3)' : 'rgba(236,72,153,.3)',
          border: `1px solid ${level === 'basico' ? 'rgba(139,92,246,.5)' : 'rgba(236,72,153,.5)'}`
        }}>
          {level === 'basico' ? 'Fácil (8 líneas)' : 'Supermáquina ★'}
        </span>
      </div>
    </motion.div>
  );
}
