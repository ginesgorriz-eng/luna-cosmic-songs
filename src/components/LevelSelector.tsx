"use client";
import { motion } from "framer-motion";

interface LevelSelectorProps {
  level: 'basico' | 'avanzado';
  onLevelChange: (level: 'basico' | 'avanzado') => void;
  compact?: boolean; // for in-game toggle
}

export default function LevelSelector({ level, onLevelChange, compact = false }: LevelSelectorProps) {
  if (compact) {
    return (
      <button
        onClick={() => onLevelChange(level === 'basico' ? 'avanzado' : 'basico')}
        className="px-3 py-1.5 rounded-md font-bold text-xs text-white transition-all"
        style={{
          background: 'rgba(139,92,246,.4)',
          border: '2px solid rgba(236,72,153,.7)',
          textShadow: '0 1px 3px rgba(0,0,0,.7)',
        }}
      >
        {level === 'basico' ? 'Nivel fácil (8 líneas)' : 'Nivel Supermáquina ★'}
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.85 }}
      className="glass rounded-2xl p-4 flex gap-3 flex-wrap justify-center max-w-lg mx-auto"
    >
      <button
        onClick={() => onLevelChange('basico')}
        className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
          level === 'basico'
            ? 'bg-gradient-to-br from-cosmic-purple to-cosmic-purple/60 text-white shadow-lg shadow-cosmic-purple/30 border border-cosmic-purple/80'
            : 'bg-white/5 text-white/60 border border-white/20 hover:bg-cosmic-purple/15 hover:border-cosmic-purple/40 hover:text-white/90'
        }`}
      >
        Nivel fácil (8 líneas)
      </button>
      <button
        onClick={() => onLevelChange('avanzado')}
        className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
          level === 'avanzado'
            ? 'bg-gradient-to-br from-cosmic-purple to-cosmic-purple/60 text-white shadow-lg shadow-cosmic-purple/30 border border-cosmic-purple/80'
            : 'bg-white/5 text-white/60 border border-white/20 hover:bg-cosmic-purple/15 hover:border-cosmic-purple/40 hover:text-white/90'
        }`}
      >
        Nivel Supermáquina (canción completa)
      </button>
    </motion.div>
  );
}
