#!/bin/bash
# pre-flight.sh — Verificación obligatoria antes de cada sesión de trabajo
# Ejecutar SIEMPRE al inicio de sesión, ANTES de editar cualquier fichero
#
# Uso: cd luna-cosmic-songs && bash scripts/pre-flight.sh
#
# Última actualización: 14 abr 2026

set -e

echo "============================================"
echo "  PRE-FLIGHT CHECK — Luna Kosmic Songs"
echo "  $(date '+%d %b %Y %H:%M')"
echo "============================================"
echo ""

FAILURES=0
WARNINGS=0
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

# ─────────────────────────────────────────────
# FASE 1: Verificar integridad de ficheros críticos
# ─────────────────────────────────────────────
echo "📂 FASE 1: Verificando integridad de ficheros..."
echo ""

# Leer .critical-files.json y verificar cada fichero
CRITICAL_FILES=(
  "src/contexts/SpotifyContext.tsx:50"
  "src/app/layout.tsx:15"
  "src/app/page.tsx:100"
  "src/components/TableroJuego.tsx:200"
  "src/lib/game-logic.ts:30"
  "src/lib/canciones-data.ts:100"
  "src/lib/supabase.ts:200"
)

TRUNCATED_FILES=()

for entry in "${CRITICAL_FILES[@]}"; do
  FILE=$(echo "$entry" | cut -d: -f1)
  MIN_LINES=$(echo "$entry" | cut -d: -f2)

  if [ ! -f "$FILE" ]; then
    echo "  ❌ FALTA: $FILE"
    FAILURES=$((FAILURES + 1))
    continue
  fi

  ACTUAL=$(wc -l < "$FILE")

  if [ "$ACTUAL" -lt "$MIN_LINES" ]; then
    echo "  ⚠️  POSIBLE TRUNCAMIENTO: $FILE ($ACTUAL líneas, mínimo esperado: $MIN_LINES)"
    TRUNCATED_FILES+=("$FILE")
    WARNINGS=$((WARNINGS + 1))

    # Intentar comparar con git
    if git show HEAD:"$FILE" > /dev/null 2>&1; then
      GIT_LINES=$(git show HEAD:"$FILE" | wc -l)
      echo "      → En git: $GIT_LINES líneas. En disco: $ACTUAL líneas."
      if [ "$GIT_LINES" -gt "$ACTUAL" ]; then
        echo "      → RECUPERANDO de git..."
        git checkout HEAD -- "$FILE"
        NEW_LINES=$(wc -l < "$FILE")
        echo "      → Recuperado: $NEW_LINES líneas ✅"
      fi
    fi
  else
    echo "  ✅ $FILE ($ACTUAL líneas)"
  fi
done

# ─────────────────────────────────────────────
# FASE 2: Verificar invariantes técnicas
# ─────────────────────────────────────────────
echo ""
echo "🔒 FASE 2: Verificando invariantes técnicas..."
echo ""

# I1: SpotifyProvider en layout.tsx
if ! grep -q "SpotifyProvider" src/app/layout.tsx 2>/dev/null; then
  echo "  ❌ I1 VIOLADA: SpotifyProvider no está en layout.tsx"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ I1: SpotifyProvider en layout.tsx"
fi

# I2: Iframe en SpotifyContext
if ! grep -q "<iframe" src/contexts/SpotifyContext.tsx 2>/dev/null; then
  echo "  ❌ I2 VIOLADA: No hay iframe en SpotifyContext.tsx"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ I2: Iframe de Spotify presente"
fi

# createPortal en SpotifyContext
if ! grep -q "createPortal" src/contexts/SpotifyContext.tsx 2>/dev/null; then
  echo "  ⚠️  I2b: createPortal no encontrado en SpotifyContext.tsx"
  WARNINGS=$((WARNINGS + 1))
else
  echo "  ✅ I2b: createPortal en SpotifyContext.tsx"
fi

# I3: Link a registro
if ! grep -q "registro" src/components/TableroJuego.tsx 2>/dev/null; then
  echo "  ⚠️  I3: No se encuentra 'registro' en TableroJuego.tsx"
  WARNINGS=$((WARNINGS + 1))
else
  echo "  ✅ I3: Referencia a registro en TableroJuego"
fi

# I5: Texto de Luna
if ! grep -q "Ostia Makinas" src/app/page.tsx 2>/dev/null; then
  echo "  ❌ I5 VIOLADA: Texto de Luna modificado en page.tsx"
  FAILURES=$((FAILURES + 1))
else
  echo "  ✅ I5: Texto de Luna intacto"
fi

# ─────────────────────────────────────────────
# FASE 3: Estado de git
# ─────────────────────────────────────────────
echo ""
echo "📦 FASE 3: Estado del repositorio..."
echo ""

# Cambios sin commit
UNCOMMITTED=$(git status --short | wc -l)
if [ "$UNCOMMITTED" -gt 0 ]; then
  echo "  ⚠️  $UNCOMMITTED ficheros con cambios sin commit:"
  git status --short | head -10
  if [ "$UNCOMMITTED" -gt 10 ]; then
    echo "  ... y $((UNCOMMITTED - 10)) más"
  fi
  WARNINGS=$((WARNINGS + 1))
else
  echo "  ✅ Repositorio limpio"
fi

# Último commit
echo ""
echo "  Último commit:"
git log --oneline -1

# ─────────────────────────────────────────────
# FASE 4: Recordatorios
# ─────────────────────────────────────────────
echo ""
echo "📋 FASE 4: Recordatorios de sesión"
echo ""
echo "  1. ¿Has leído ENTRADA.md? (el fichero que estás leyendo ahora)"
echo "  2. ¿Has montado Obsidian y leído los aprendizajes?"
echo "  3. ¿Has leído .agent-protocol.md?"
echo "  4. Recuerda: Edit, no Write. Un cambio por iteración."
echo "  5. Documenta bugs resueltos INMEDIATAMENTE en Obsidian."

# ─────────────────────────────────────────────
# RESUMEN
# ─────────────────────────────────────────────
echo ""
echo "============================================"
if [ $FAILURES -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo "  ✅ PRE-FLIGHT: TODO OK — Listo para trabajar"
elif [ $FAILURES -eq 0 ]; then
  echo "  ⚠️  PRE-FLIGHT: $WARNINGS advertencias — Revisar antes de editar"
else
  echo "  ❌ PRE-FLIGHT: $FAILURES fallos, $WARNINGS advertencias"
  echo "  RESOLVER FALLOS ANTES DE EDITAR CÓDIGO"
fi
echo "============================================"

exit $FAILURES
