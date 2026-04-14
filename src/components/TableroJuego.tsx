"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { ALL_SONGS, shuffle } from "@/lib/canciones-data";
import {
  buildAllPhases,
  getLinesForLevel,
  validateColumn,
  type LineValidation,
} from "@/lib/game-logic";
import type { Cancion, LineaCancion } from "@/lib/canciones-data";
// ScoreBar and LevelSelector replaced by inline controls
import Link from "next/link";
import ColumnaCancion from "./ColumnaCancion";
import FichaFlotante from "./FichaFlotante";
import Particles, { useParticles } from "./Particles";
import ToastContainer, { useToast } from "./Toast";

interface TableroJuegoProps {
  level: "basico" | "avanzado";
  onLevelChange: (level: "basico" | "avanzado") => void;
}

interface ColumnState {
  [songId: string]: LineaCancion[];
}

interface ValidationState {
  [songId: string]: LineValidation[] | null;
}

interface FeedbackState {
  [songId: string]: string | null;
}

export default function TableroJuego({
  level,
  onLevelChange,
}: TableroJuegoProps) {
  // Initialize game phases — client-only to avoid hydration mismatch
  const [phases, setPhases] = useState<Cancion[][]>([]);
  const [phasesReady, setPhasesReady] = useState(false);
  useEffect(() => {
    setPhases(buildAllPhases());
    setPhasesReady(true);
  }, []);

  // Game state
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [columnStates, setColumnStates] = useState<ColumnState>({});
  const [validationStates, setValidationStates] = useState<ValidationState>({});
  const [completedSongs, setCompletedSongs] = useState<Set<string>>(
    new Set()
  );
  const [score, setScore] = useState(0);
  const [feedbackStates, setFeedbackStates] = useState<FeedbackState>({});

  // Effects & UI state
  const [draggedLineId, setDraggedLineId] = useState<string | null>(null);
  const { particles, createParticles } = useParticles();
  const { toasts, showToast } = useToast();

  // Check if user is registered (set by login/registro pages)
  const [makinaName, setMakinaName] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  useEffect(() => {
    const logged = sessionStorage.getItem('makina_logged');
    const name = sessionStorage.getItem('makina_name');
    if (logged === '1' && name) {
      setIsRegistered(true);
      setMakinaName(name);
    }
  }, []);

  // Sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  // Get current phase songs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentPhaseSongs = useMemo(() => phases[currentPhaseIndex] || [], [phases, currentPhaseIndex]);

  // Initialize column states for current phase
  useEffect(() => {
    const newColumnStates: ColumnState = {};
    currentPhaseSongs.forEach(song => {
      if (!columnStates[song.id]) {
        newColumnStates[song.id] = [];
      }
    });
    if (Object.keys(newColumnStates).length > 0) {
      setColumnStates(prev => ({ ...prev, ...newColumnStates }));
    }
  }, [currentPhaseIndex, currentPhaseSongs]);

  // Shuffled line order — computed once per phase, then filtered by what's used
  const [shuffledPhaseLines, setShuffledPhaseLines] = useState<LineaCancion[]>([]);
  useEffect(() => {
    const allLines: LineaCancion[] = [];
    currentPhaseSongs.forEach(song => {
      // Get ALL lines (avanzado) so switching level doesn't re-shuffle
      song.lineas.forEach(line => allLines.push(line));
    });
    setShuffledPhaseLines(shuffle(allLines));
  }, [currentPhaseIndex, phasesReady]);

  // Get available lines for espacio zone (filtered from shuffled order)
  const availableLines = useMemo(() => {
    const used = new Set<string>();
    Object.values(columnStates).forEach(lines => {
      lines.forEach(line => used.add(line.id));
    });

    // Only show lines valid for current level
    const validIds = new Set<string>();
    currentPhaseSongs.forEach(song => {
      getLinesForLevel(song, level).forEach(line => validIds.add(line.id));
    });

    return shuffledPhaseLines.filter(
      line => !used.has(line.id) && validIds.has(line.id)
    );
  }, [columnStates, currentPhaseSongs, level, shuffledPhaseLines]);

  // Handle level change - recalculate lines for all songs in current phase
  const handleLevelChange = useCallback(
    (newLevel: "basico" | "avanzado") => {
      onLevelChange(newLevel);
      // Reset column states as line counts change
      const newColumnStates: ColumnState = {};
      currentPhaseSongs.forEach(song => {
        newColumnStates[song.id] = [];
      });
      setColumnStates(newColumnStates);
      setValidationStates({});
      setFeedbackStates({});
      showToast("Nivel cambiado. Las columnas se han reiniciado.", "info");
    },
    [currentPhaseSongs, onLevelChange, showToast]
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setDraggedLineId(event.active.id as string);
  };

  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're dragging between columns or within a column
    setColumnStates(prev => {
      const newState = { ...prev };

      // Find which column contains the active item
      let sourceColumnId: string | null = null;
      let sourceIndex = -1;

      for (const [colId, lines] of Object.entries(newState)) {
        const idx = lines.findIndex(l => l.id === activeId);
        if (idx !== -1) {
          sourceColumnId = colId;
          sourceIndex = idx;
          break;
        }
      }

      // If active is from espacio, find it
      if (!sourceColumnId) {
        const lineInEspacio = availableLines.find(l => l.id === activeId);
        if (!lineInEspacio) return prev;
        sourceColumnId = "ESPACIO";
      }

      // Find destination
      let destColumnId: string | null = null;
      let destIndex = -1;

      // Check if over is a column ID
      if (newState[overId] !== undefined) {
        destColumnId = overId;
        destIndex = newState[overId].length;
      } else {
        // Find which column contains the over item
        for (const [colId, lines] of Object.entries(newState)) {
          const idx = lines.findIndex(l => l.id === overId);
          if (idx !== -1) {
            destColumnId = colId;
            destIndex = idx;
            break;
          }
        }
      }

      if (!destColumnId) return prev;
      // Same container? Skip (reorder handled in dragEnd)
      if (sourceColumnId === destColumnId) return prev;

      // Get the line to move
      let lineToMove: LineaCancion | undefined;
      if (sourceColumnId === "ESPACIO") {
        lineToMove = shuffledPhaseLines.find(l => l.id === activeId);
      } else {
        lineToMove = newState[sourceColumnId]?.[sourceIndex];
      }

      if (!lineToMove) return prev;

      // Prevent duplicates: if already in destination, skip
      if (newState[destColumnId]?.some(l => l.id === activeId)) return prev;

      // Remove from source (all columns, to prevent any stale duplicates)
      for (const colId of Object.keys(newState)) {
        newState[colId] = newState[colId].filter(l => l.id !== activeId);
      }

      // Add to destination
      if (!newState[destColumnId]) {
        newState[destColumnId] = [];
      }
      newState[destColumnId].splice(destIndex, 0, lineToMove);

      // Clear validation and feedback for affected columns
      setValidationStates(prev => ({
        ...prev,
        [sourceColumnId]: null,
        [destColumnId]: null,
      }));
      setFeedbackStates(prev => ({
        ...prev,
        [sourceColumnId]: null,
        [destColumnId]: null,
      }));

      return newState;
    });
  };

  // Handle drag end — reorder within same column
  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedLineId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find if both are in the same column
    setColumnStates(prev => {
      for (const [colId, lines] of Object.entries(prev)) {
        const oldIdx = lines.findIndex(l => l.id === activeId);
        const newIdx = lines.findIndex(l => l.id === overId);
        if (oldIdx !== -1 && newIdx !== -1) {
          const reordered = arrayMove(lines, oldIdx, newIdx);
          return { ...prev, [colId]: reordered };
        }
      }
      return prev;
    });
  };

  // Handle validation of a column
  const handleValidateColumn = useCallback(
    (songId: string) => {
      const lines = columnStates[songId] || [];
      const validation = validateColumn(songId, lines, level);

      setValidationStates(prev => ({
        ...prev,
        [songId]: validation.results,
      }));

      if (validation.allCorrect && !completedSongs.has(songId)) {
        setCompletedSongs(prev => { const next = new Set(prev); next.add(songId); return next; });
        setScore(prev => prev + 10);
        createParticles(20);
        const songName = ALL_SONGS.find(s => s.id === songId)?.nombre;
        setFeedbackStates(prev => ({ ...prev, [songId]: `¡"${songName}" completada! 🎵` }));
        showToast(`¡Makina! "${songName}" recompuesta +10 pts`, "success");
      } else if (validation.allCorrect) {
        setFeedbackStates(prev => ({ ...prev, [songId]: "Ya la tienes, ¡a por la siguiente! 🌙" }));
      } else {
        const parts: string[] = [];
        if (validation.greenCount > 0) parts.push(`🟢 ${validation.greenCount} bien`);
        if (validation.yellowCount > 0) parts.push(`🟡 ${validation.yellowCount} desordenados`);
        if (validation.redCount > 0) parts.push(`🔴 ${validation.redCount} de otra canción`);
        setFeedbackStates(prev => ({ ...prev, [songId]: parts.join(' · ') }));
      }
    },
    [columnStates, level, completedSongs, createParticles, showToast]
  );

  // Handle double-click to return line to espacio
  const handleReturnToEspacio = useCallback((lineId: string) => {
    setColumnStates(prev => {
      const newState = { ...prev };
      for (const colId of Object.keys(newState)) {
        newState[colId] = newState[colId].filter(l => l.id !== lineId);
      }
      setValidationStates(prevVal => {
        const newVal = { ...prevVal };
        for (const colId of Object.keys(newVal)) {
          newVal[colId] = null;
        }
        return newVal;
      });
      return newState;
    });
  }, []);

  // Handle next phase
  const handleNextPhase = useCallback(() => {
    const nextIndex = (currentPhaseIndex + 1) % phases.length;
    setCurrentPhaseIndex(nextIndex);
    setColumnStates({});
    setValidationStates({});
    setFeedbackStates({});
    setCompletedSongs(new Set());
    if (nextIndex === 0) {
      showToast("¡Vuelta completa! Empezamos de nuevo con nuevas fases 🌙", "success");
    } else {
      showToast(`¡Fase ${nextIndex + 1}! Vamos allá, Makina 🌙`, "info");
    }
  }, [currentPhaseIndex, phases.length, showToast]);

  // Get all song IDs for sortable context
  const allSongIds = currentPhaseSongs.map(s => s.id);

  if (!phasesReady) {
    return (
      <div className="relative min-h-screen w-full bg-cosmic-bg flex items-center justify-center">
        <p className="relative z-10 text-white/50 text-lg">Preparando el cosmos...</p>
      </div>
    );
  }

  return (
    <>
    {/* Floating UI — outside overflow-hidden container so particles aren't clipped */}
    <Particles particles={particles} />
    <ToastContainer toasts={toasts} />

    <div className="relative min-h-screen w-full bg-cosmic-bg overflow-x-hidden">
      {/* Album cover background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/bg-juego.jpg')",
          filter: "brightness(0.50)",
        }}
      />
      {/* Content */}
      <div className="relative z-10 px-4 py-3 max-w-7xl mx-auto">
        {/* Top bar: Title left + Zona cliente right */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-3"
        >
          {/* Left: Title */}
          <div>
            <h1 className="text-[11px] md:text-2xl font-black leading-tight">
              <span className="italic" style={{ background: 'linear-gradient(90deg, #68A542, #EAB3CB, #F5D547)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Luna Ki</span>{' '}
              <span style={{ background: 'linear-gradient(90deg, #68A542, #EAB3CB, #F5D547)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Misión lyrics</span>{' '}
              <span className="text-white">🌙</span>
            </h1>
            <p className="text-xs text-white/50 mt-0.5">
              Arrastra versos a las columnas y móntalas en orden
            </p>
          </div>

          {/* Score + user box */}
          <div className="shrink-0 ml-4 backdrop-blur-sm rounded-xl px-3 py-2 text-right" style={{ background: "rgba(95,203,190,0.15)", border: "1px solid rgba(95,203,190,0.4)" }}>
            {isRegistered ? (
              <>
                <p className="text-[11px] font-bold text-[#68A542]">Mákina registrada</p>
                <p className="text-[9px] text-white/60 mt-0.5">{makinaName}</p>
              </>
            ) : (
              <>
                <Link
                  href="/registro"
                  className="inline-block px-2.5 py-1 rounded-md transition-all"
                  style={{
                    background: "rgba(234,179,203,0.2)",
                    border: "1px solid rgba(234,179,203,0.5)",
                  }}
                >
                  <span className="block text-[10px] font-bold text-[#EAB3CB]">Regístrate</span>
                  <span className="block text-[7px] text-[#EAB3CB]/60 leading-tight mt-0.5">guarda puntos y transfórmate<br/>en SuperMákina</span>
                </Link>
              </>
            )}
            <p className="mt-1.5">
              <span className="text-sm font-black text-cosmic-purple">{score}</span>
              <span className="text-[10px] text-white/50 ml-1">pts</span>
            </p>
            <p className="text-[10px] text-white/40">Fase {currentPhaseIndex + 1}/{phases.length} · {level === 'basico' ? 'Fácil' : 'SuperMákina'}</p>
          </div>
        </motion.div>

        {/* Control strip: level buttons + next phase */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <button
            onClick={() => handleLevelChange('basico')}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
            style={
              level === 'basico'
                ? { background: '#EAB3CB50', color: '#fff', border: '1px solid #EAB3CB90' }
                : { color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)' }
            }
          >
            Nivel fácil
          </button>
          <button
            onClick={() => handleLevelChange('avanzado')}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
            style={
              level === 'avanzado'
                ? { background: '#D6334850', color: '#fff', border: '1px solid #D6334890' }
                : { color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)' }
            }
          >
            Nivel Supermákina
          </button>
          <button
            onClick={handleNextPhase}
            className="px-3 py-1.5 rounded-md text-xs font-semibold text-white/50 border border-white/15 hover:border-white/40 hover:text-white/80 transition-all ml-auto"
          >
            Siguientes 4 canciones →
          </button>
        </div>

        {/* Game Board - 4 Columns */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="mb-8 grid grid-cols-2 landscape:grid-cols-4 md:grid-cols-4 gap-2 md:gap-4 items-start">
            {currentPhaseSongs.map((song, idx) => (
              <SortableContext
                key={song.id}
                items={[song.id, ...(columnStates[song.id] || []).map(l => l.id)]}
                strategy={rectSortingStrategy}
              >
                <ColumnaCancion
                  id={song.id}
                  songName={song.nombre}
                  lineas={columnStates[song.id] || []}
                  validationResults={validationStates[song.id] || null}
                  columnIndex={idx}
                  onValidar={() => handleValidateColumn(song.id)}
                  isValidated={completedSongs.has(song.id)}
                  feedbackMsg={feedbackStates[song.id] || null}
                />
              </SortableContext>
            ))}
          </div>

          {/* Espacio Zone - Available Lines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 transition-all"
            style={{
              background: "transparent",
              border: "none",
            }}
          >
            <h3 className="text-sm font-bold text-white/70 mb-3">
              Versos disponibles ({availableLines.length})
            </h3>
            <SortableContext
              items={availableLines.map(l => l.id)}
              strategy={rectSortingStrategy}
            >
              <div className="flex flex-wrap gap-1.5">
                <AnimatePresence>
                  {availableLines.length > 0 ? (
                    availableLines.map((linea, idx) => (
                      <motion.div
                        key={linea.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.35, ease: "easeInOut", layout: { duration: 0.3 } }}
                      >
                        <FichaFlotante
                          id={linea.id}
                          texto={linea.texto}
                          index={idx}
                          isInColumn={false}
                          onDoubleClick={() => handleReturnToEspacio(linea.id)}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-white/40 text-sm py-4 w-full text-center">
                      ¡Todos los versos están colocados! 🎉
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </SortableContext>
          </motion.div>

          {/* Drag Overlay */}
          <DragOverlay>
            {draggedLineId ? (
              <FichaFlotante
                id={draggedLineId}
                texto={
                  availableLines.find(l => l.id === draggedLineId)?.texto ||
                  currentPhaseSongs.flatMap(s => columnStates[s.id] || []).find(
                    l => l.id === draggedLineId
                  )?.texto ||
                  "..."
                }
                index={0}
                isInColumn={false}
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>

    </div>
    </>
  );
}
