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

// Colores para botones de validación (uno por columna)
const BUTTON_COLORS = [
  "#F6B258",
  "#5FCBBE",
  "#8FCBE4",
  "#F1B4CF",
  "#F9C140",
  "#1FC4A8",
  "#A1D9D9",
  "#CF464B",
  "#8C8A4C",
  "#D63348",
  "#68A542",
  "#EAB3CB",
  "#FFCB3A",
  "#F4BFBF",
];

// Colores de fondo de cada caja de canción (tono ligero)
const BOX_COLORS = [
  "#D7E2CA",
  "#8FCBE4",
  "#EAB3CB",
  "#DECE86",
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
        background: `${BOX_COLORS[columnIndex % BOX_COLORS.length]}40`,
        border: `1px solid ${BOX_COLORS[columnIndex % BOX_COLORS.length]}70`,
        backdropFilter: "blur(6px)",
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
          background: "rgba(255,255,255,0.03)",
          border: "2px dashed rgba(255,255,255,0.12)",
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

      {/* Validation button — colored per column */}
      <div className="relative group">
        <motion.button
          onClick={onValidar}
          disabled={isValidated}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer"
          style={
            isValidated
              ? { background: "#68A542E6", color: "#fff", border: "1px solid #68A542" }
              : lineas.length === 0
              ? { background: `${BUTTON_COLORS[columnIndex % BUTTON_COLORS.length]}E6`, color: "rgba(255,255,255,0.9)", border: `1px solid ${BUTTON_COLORS[columnIndex % BUTTON_COLORS.length]}` }
              : { background: `${BUTTON_COLORS[columnIndex % BUTTON_COLORS.length]}E6`, color: "#fff", border: `1px solid ${BUTTON_COLORS[columnIndex % BUTTON_COLORS.length]}` }
          }
        >
          {isValidated ? "¡Lo tengo! ✓" : BUTTON_TEXTS[columnIndex % BUTTON_TEXTS.length]}
        </motion.button>
        {/* Tooltip on hover when no lines */}
        {lineas.length === 0 && !isValidated && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ background: "#CF464B", color: "#fff" }}
          >
            ¡Kompone primero Mákina!
          </div>
        )}
      </div>

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

      {/* Song name footer — matches header style: left-aligned with verse count */}
      <div className="mt-2 pt-2 border-t border-white/10">
        <h3 className="text-sm font-bold text-white truncate">{songName}</h3>
        <p className="text-xs text-white/50 mt-0.5">{lineas.length} versos</p>
      </div>
    </motion.div>
  );
}
