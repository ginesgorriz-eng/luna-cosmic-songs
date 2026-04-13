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
        className="px-5 py-3 rounded-xl font-semibold text-sm transition-all"
        style={
          level === 'basico'
            ? { background: '#F4BFBF', color: '#1a1a2e', border: '1px solid #F4BFBF', boxShadow: '0 4px 12px rgba(244,191,191,0.3)' }
            : { background: 'rgba(244,191,191,0.15)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(244,191,191,0.3)' }
        }
      >
        Nivel fácil (8 líneas)
      </button>
      <button
        onClick={() => onLevelChange('avanzado')}
        className="px-5 py-3 rounded-xl font-semibold text-sm transition-all"
        style={
          level === 'avanzado'
            ? { background: '#FFCB3A', color: '#1a1a2e', border: '1px solid #FFCB3A', boxShadow: '0 4px 12px rgba(255,203,58,0.3)' }
            : { background: 'rgba(255,203,58,0.15)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,203,58,0.3)' }
        }
      >
        Nivel Supermáquina (canción completa)
      </button>
    </motion.div>
  );
}
