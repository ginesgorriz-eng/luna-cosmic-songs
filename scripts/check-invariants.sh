#!/bin/bash
# check-invariants.sh — Verificar invariantes técnicas de Luna Kosmic Songs
# Ejecutar antes de commit/push o al inicio de sesión
# Uso: cd luna-cosmic-songs && bash scripts/check-invariants.sh [--skip-build]
#
# Última actualización: 14 abr 2026

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

SKIP_BUILD=false
if [ "$1" = "--skip-build" ]; then
  SKIP_BUILD=true
fi

echo "🔍 Verificando invariantes técnicas..."
echo ""
FAILURES=0
WARNINGS=0

# ─────────────────────────────────────────────
# INVARIANTES FUNCIONALES
# ─────────────────────────────────────────────
echo "── Invariantes funcionales ──"

# I1: SpotifyProvider envuelve children en layout.tsx
if ! grep -q "SpotifyProvider" src/app/layout.tsx 2>/dev/null; then
  echo "❌ I1 VIOLADA: SpotifyProvider no está en layout.tsx"
  FAILURES=$((FAILURES + 1))
else
  echo "✅ I1: SpotifyProvider en layout.tsx"
fi

# I2: Iframe de Spotify existe en SpotifyContext
if ! grep -q "<iframe" src/contexts/SpotifyContext.tsx 2>/dev/null; then
  echo "❌ I2 VIOLADA: No hay iframe en SpotifyContext.tsx"
  FAILURES=$((FAILURES + 1))
else
  echo "✅ I2: Iframe de Spotify presente"
fi

# I2b: Spotify persistence mechanism (CSS positioning, never unmounts)
if ! grep -q "containerRef" src/contexts/SpotifyContext.tsx 2>/dev/null; then
  echo "❌ I2b VIOLADA: containerRef no encontrado — mecanismo de persistencia Spotify roto"
  FAILURES=$((FAILURES + 1))
else
  echo "✅ I2b: Persistencia Spotify via CSS (containerRef)"
fi

# I3: Link a registro existe en TableroJuego
if ! grep -q "registro" src/components/TableroJuego.tsx 2>/dev/null; then
  echo "⚠️  I3: No se encuentra referencia a 'registro' en TableroJuego.tsx (verificar manualmente)"
  WARNINGS=$((WARNINGS + 1))
else
  echo "✅ I3: Referencia a registro en TableroJuego"
fi

# I4: 15 canciones en canciones-data.ts
if [ -f "src/lib/canciones-data.ts" ]; then
  SONG_COUNT=$(grep -c "nombre:" src/lib/canciones-data.ts 2>/dev/null || echo "0")
  if [ "$SONG_COUNT" -lt 15 ]; then
    echo "⚠️  I4: Solo $SONG_COUNT canciones detectadas (esperadas: 15)"
    WARNINGS=$((WARNINGS + 1))
  else
    echo "✅ I4: $SONG_COUNT canciones presentes"
  fi
else
  echo "❌ I4: Fichero canciones-data.ts no encontrado"
  FAILURES=$((FAILURES + 1))
fi

# I5: Texto de Luna intacto en home
if ! grep -q "Ostia Makinas" src/app/page.tsx 2>/dev/null; then
  echo "❌ I5 VIOLADA: Texto de Luna modificado en home"
  FAILURES=$((FAILURES + 1))
else
  echo "✅ I5: Texto de Luna intacto"
fi

# ─────────────────────────────────────────────
# INTEGRIDAD DE FICHEROS
# ─────────────────────────────────────────────
echo ""
echo "── Integridad de ficheros críticos ──"

CRITICAL_FILES=(
  "src/contexts/SpotifyContext.tsx:50"
  "src/components/TableroJuego.tsx:200"
  "src/app/layout.tsx:15"
  "src/app/page.tsx:100"
  "src/app/juego/page.tsx:10"
  "src/lib/game-logic.ts:30"
  "src/lib/canciones-data.ts:100"
  "src/lib/supabase.ts:200"
)

for entry in "${CRITICAL_FILES[@]}"; do
  FILE=$(echo "$entry" | cut -d: -f1)
  MIN_LINES=$(echo "$entry" | cut -d: -f2)

  if [ ! -f "$FILE" ]; then
    echo "❌ FALTA: $FILE"
    FAILURES=$((FAILURES + 1))
  else
    LINES=$(wc -l < "$FILE")
    if [ "$LINES" -lt "$MIN_LINES" ]; then
      echo "⚠️  POSIBLE TRUNCAMIENTO: $FILE ($LINES líneas, mínimo: $MIN_LINES)"
      WARNINGS=$((WARNINGS + 1))
    else
      echo "✅ $FILE ($LINES líneas)"
    fi
  fi
done

# ─────────────────────────────────────────────
# VERIFICACIÓN DE .locked-files
# ─────────────────────────────────────────────
echo ""
echo "── Ficheros protegidos (.locked-files) ──"

if [ -f ".locked-files" ]; then
  while IFS= read -r line; do
    # Saltar comentarios y líneas vacías
    [[ "$line" =~ ^#.*$ ]] && continue
    [[ -z "$line" ]] && continue
    FILE=$(echo "$line" | awk '{print $1}')
    if [ -f "$FILE" ]; then
      echo "✅ Protegido y presente: $FILE"
    else
      echo "❌ Protegido pero FALTA: $FILE"
      FAILURES=$((FAILURES + 1))
    fi
  done < .locked-files
else
  echo "⚠️  .locked-files no encontrado"
  WARNINGS=$((WARNINGS + 1))
fi

# ─────────────────────────────────────────────
# BUILD (opcional, se puede saltar con --skip-build)
# ─────────────────────────────────────────────
if [ "$SKIP_BUILD" = false ]; then
  echo ""
  echo "── Build ──"
  echo "🏗️  Verificando build (esto tarda ~30s)..."
  if npx next build > /dev/null 2>&1; then
    echo "✅ Build OK"
  else
    echo "❌ BUILD FAILED"
    FAILURES=$((FAILURES + 1))
  fi
else
  echo ""
  echo "── Build: SALTADO (--skip-build) ──"
fi

# ─────────────────────────────────────────────
# RESUMEN
# ─────────────────────────────────────────────
echo ""
echo "============================================"
if [ $FAILURES -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo "✅ TODAS LAS INVARIANTES OK ($((${#CRITICAL_FILES[@]} + 6)) checks)"
elif [ $FAILURES -eq 0 ]; then
  echo "⚠️  $WARNINGS advertencias, 0 fallos"
else
  echo "❌ $FAILURES invariantes violadas, $WARNINGS advertencias"
fi
echo "============================================"

exit $FAILURES
