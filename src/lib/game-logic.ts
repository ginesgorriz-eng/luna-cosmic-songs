import { ALL_SONGS, type Cancion, type LineaCancion } from './canciones-data';

// Build phases: 1 published + 3 unpublished per phase (critical rule)
export function buildAllPhases(): Cancion[][] {
  const pub = ALL_SONGS.filter(s => s.publicada);
  const unp = ALL_SONGS.filter(s => !s.publicada);
  // Shuffle both pools
  const shuffledPub = [...pub].sort(() => Math.random() - 0.5);
  const shuffledUnp = [...unp].sort(() => Math.random() - 0.5);

  const phases: Cancion[][] = [];
  let pi = 0, ui = 0;
  while (pi < shuffledPub.length || ui < shuffledUnp.length) {
    const phase: Cancion[] = [];
    if (pi < shuffledPub.length) phase.push(shuffledPub[pi++]);
    while (phase.length < 4 && ui < shuffledUnp.length) phase.push(shuffledUnp[ui++]);
    while (phase.length < 4 && pi < shuffledPub.length) phase.push(shuffledPub[pi++]);
    if (phase.length > 0) phases.push(phase);
  }
  return phases;
}

// Get lines for a song based on difficulty level
export function getLinesForLevel(song: Cancion, level: 'basico' | 'avanzado'): LineaCancion[] {
  return level === 'basico' ? song.lineas.slice(0, 8) : song.lineas;
}

// Validation result for a single line
export type LineValidation = 'correct' | 'wrong-position' | 'wrong-song';

// Validate a column
export function validateColumn(
  songId: string,
  placedLines: LineaCancion[],
  level: 'basico' | 'avanzado'
): { results: LineValidation[]; allCorrect: boolean; greenCount: number; yellowCount: number; redCount: number } {
  const song = ALL_SONGS.find(s => s.id === songId);
  if (!song) return { results: [], allCorrect: false, greenCount: 0, yellowCount: 0, redCount: 0 };

  const expectedLines = getLinesForLevel(song, level);
  let greenCount = 0, yellowCount = 0, redCount = 0;

  const results: LineValidation[] = placedLines.map((line, idx) => {
    if (line.songId !== songId) {
      redCount++;
      return 'wrong-song';
    } else if (idx < expectedLines.length && line.id === expectedLines[idx].id) {
      greenCount++;
      return 'correct';
    } else {
      yellowCount++;
      return 'wrong-position';
    }
  });

  const allCorrect = placedLines.length === expectedLines.length && greenCount === expectedLines.length;
  return { results, allCorrect, greenCount, yellowCount, redCount };
}
