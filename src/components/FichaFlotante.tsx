'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

type ValidationColor = 'correct' | 'wrong-position' | 'wrong-song';

interface FichaFlotanteProps {
  id: string;
  texto: string;
  index: number;
  isInColumn?: boolean;
  validationColor?: ValidationColor;
  onDoubleClick?: () => void;
}

export default function FichaFlotante({
  id,
  texto,
  index,
  isInColumn = false,
  validationColor,
  onDoubleClick,
}: FichaFlotanteProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Validation color mapping
  const validationStyles = {
    correct: {
      border: 'border-cosmic-success',
      bg: 'bg-emerald-500/20',
      shadow: 'shadow-emerald-500/20',
    },
    'wrong-position': {
      border: 'border-amber-400/60',
      bg: 'bg-amber-500/20',
      shadow: 'shadow-amber-500/20',
    },
    'wrong-song': {
      border: 'border-cosmic-error',
      bg: 'bg-red-500/20',
      shadow: 'shadow-red-500/20',
    },
  };

  const validation = validationColor ? validationStyles[validationColor] : null;

  // Float animation only when NOT in a column
  const floatVariants = isInColumn
    ? { y: 0, rotate: 0 }
    : {
        y: [-8, 8, -8],
        rotate: [-1, 1, -1],
      };

  const floatTransition = isInColumn
    ? {}
    : {
        duration: 3 + index * 0.2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: floatVariants.y,
        rotate: floatVariants.rotate,
      }}
      transition={{
        opacity: { duration: 0.3 },
        ...floatTransition,
      }}
      whileHover={{ scale: isInColumn ? 1 : 1.05 }}
      whileDrag={{
        scale: 1.15,
        rotate: 5,
        zIndex: 1000,
        boxShadow: '0 20px 60px rgba(168, 85, 247, 0.4)',
      }}
      onDoubleClick={onDoubleClick}
      className={`
        relative px-2.5 py-1.5 rounded-md backdrop-blur-sm cursor-grab active:cursor-grabbing
        touch-none select-none transition-all duration-200 text-white
        bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10
        ${isDragging ? 'scale-125 rotate-6 z-[1000] border-purple-400 shadow-lg shadow-purple-500/50' : 'border border-white/20'}
        ${validation ? `border-2 ${validation.border} ${validation.bg} shadow-lg ${validation.shadow}` : ''}
      `}
      {...attributes}
      {...listeners}
    >
      <p className="text-xs font-medium text-white/90 leading-snug line-clamp-2 break-words">
        {texto}
      </p>
    </motion.div>
  );
}
