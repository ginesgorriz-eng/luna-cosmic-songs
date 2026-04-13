"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import FichaFlotante from "./FichaFlotante";
import type { LineaCancion } from "@/lib/canciones-data";
import type { LineValidation } from "@/lib/game-logic";

const BUTTON_TEXTS = [
  "Soy Éminem",
  "Soy Putón",
  "Soy Ki",
  "Soy Hello Kitty",
  "Soy una reina",
  "Soy Makina",
];

interface ColumnaCancionProps {
  id: string;
  songName: string;
  lineas: LineaCancion[];
  validationResults?: LineValidation[] | null;
  columnIndex?: number;
  onValidar: () => void;
  isValidated?: boolean;
  feedbackMsg?: string | null;
}

export default function ColumnaCancion({
  id,
  songName,
  lineas,
  validationResults = null,
  columnIndex = 0,
  onValidar,
  isValidated = false,
  feedbackMsg = null,
}: ColumnaCancionProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full rounded-xl p-3 transition-all"
      style={{
        background: "rgba(20,10,40,0.35)",
        border: "1px solid rgba(139,92,246,0.25)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Song name header */}
      <div className="mb-3 pb-2 border-b border-white/10">
        <h3 className="text-sm font-bold text-white truncate">
          {songName}
        </h3>
        <p className="text-xs text-white/50 mt-0.5">
          {lineas.length} versos
        </p>
      </div>

      {/* Drop zone for lines */}
      <div
        ref={setNodeRef}
        className="flex-1 flex flex-col gap-2 min-h-[200px] rounded-lg p-2 mb-3 transition-all"
        style={{
          background: "rgba(139,92,246,0.05)",
          border: "2px dashed rgba(139,92,246,0.2)",
        }}
      >
        {lineas.length > 0 ? (
          <SortableContext
            items={lineas.map(l => l.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence mode="popLayout">
              {lineas.map((linea, idx) => (
                <div key={linea.id} className="w-full">
                  <FichaFlotante
                    id={linea.id}
                    texto={linea.texto}
                    index={idx}
                    isInColumn={true}
                    validationColor={validationResults?.[idx] as "correct" | "wrong-position" | "wrong-song" | undefined}
                  />
                </div>
              ))}
            </AnimatePresence>
          </SortableContext>
        ) : (
          <div className="flex items-center justify-center h-full text-white/40 text-xs text-center">
            <span>Agrega líneas de letra a la canción</span>
          </div>
        )}
      </div>

      {/* Validation button — subtle style */}
      <motion.button
        onClick={onValidar}
        disabled={isValidated || lineas.length === 0}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`
          w-full py-1.5 rounded-md text-xs font-semibold transition-all
          ${
            isValidated
              ? "bg-cosmic-success/30 text-cosmic-success border border-cosmic-success/50 cursor-not-allowed"
              : lineas.length === 0
              ? "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"
              : "bg-cosmic-purple/25 text-white/90 border border-cosmic-purple/50 hover:bg-cosmic-purple/40 hover:text-white hover:border-cosmic-purple/70 shadow-md shadow-cosmic-purple/10"
          }
        `}
      >
        {isValidated ? "¡Lo tengo! ✓" : BUTTON_TEXTS[columnIndex % BUTTON_TEXTS.length]}
      </motion.button>

      {/* Feedback message next to button */}
      <AnimatePresence>
        {feedbackMsg && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-white/70 text-center mt-1.5 leading-tight"
          >
            {feedbackMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
