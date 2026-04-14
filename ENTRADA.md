# ENTRADA — Luna Kosmic Songs

> **LEE ESTE FICHERO COMPLETO ANTES DE HACER NADA MÁS.**
> Este es tu briefing de sesión. Contiene todo lo que necesitas para no romper cosas.
> Última actualización: 14 abr 2026

---

## 1. ESTADO ACTUAL DEL PROYECTO

- **Nombre:** Luna Kosmic Songs (con K)
- **Estado:** M7 completado (~70% del proyecto total)
- **Última sesión:** 13 abr 2026
- **Último commit:** `6003d07` — feat: footer global, cookie banner, spotify persistence
- **Deploy:** Vercel (sincronizado con GitHub)
- **Bugs activos:** 0 confirmados
- **Bugs resueltos que NO deben reintroducirse:** 3 (ver sección 3)

---

## 2. APRENDIZAJES CRÍTICOS — NO VIOLAR

### 2.1 Spotify deja de sonar al cambiar de página (B1)
**Severidad:** CRÍTICA
**Fichero clave:** `src/contexts/SpotifyContext.tsx` (91 líneas)

**Problema:** Al navegar de `/` a `/juego`, React desmonta componentes de página. Si el iframe de Spotify está en un componente que se desmonta, la música para.

**Solución implementada:** SpotifyProvider vive en `layout.tsx` envolviendo TODA la app. El iframe se crea UNA SOLA VEZ dentro del Provider. En home se renderiza visible en `#spotify-portal-target` usando `createPortal`. En otras páginas se mueve a un div oculto con CSS (`position: fixed; left: -9999px`) pero NUNCA se elimina del DOM.

**Verificación rápida:**
```bash
grep -c "createPortal" src/contexts/SpotifyContext.tsx   # debe ser ≥1
grep -c "SpotifyProvider" src/app/layout.tsx              # debe ser ≥2
```

**Regla:** NUNCA desmontar el iframe. NUNCA reescribir SpotifyContext.tsx sin leer esto primero.

### 2.2 Ficheros truncados en sandbox (B2)
**Severidad:** CRÍTICA

**Problema:** El sandbox de Cowork a veces monta ficheros incompletos (les faltan líneas al final).

**Protocolo OBLIGATORIO antes de editar cualquier fichero:**
```bash
wc -l FICHERO
tail -5 FICHERO
git show HEAD:FICHERO | wc -l
```
Si difieren más de 3 líneas → recuperar de git: `git checkout HEAD -- FICHERO`

**Cadena de recuperación (en orden):**
1. `git checkout HEAD -- ruta/fichero`
2. `git show COMMIT:ruta/fichero` (buscar en historial)
3. GitHub remoto
4. Copia en PC del usuario (fuera del sandbox)
5. **ÚLTIMO RECURSO:** reescribir con autorización EXPLÍCITA del usuario

**Regla:** NUNCA reescribir un fichero truncado. SIEMPRE recuperar de git primero.

### 2.3 Puntos dobles al validar (B3)
**Fichero clave:** `src/components/TableroJuego.tsx`
**Solución:** Variable `ptsGivenForSong` (Set) que trackea qué canciones ya dieron puntos. Se resetea al cambiar de fase.

---

## 3. INVARIANTES TÉCNICAS — DEBEN SER VERDAD SIEMPRE

| ID | Invariante | Verificación |
|----|-----------|--------------|
| I1 | SpotifyProvider envuelve children en layout.tsx | `grep -q "SpotifyProvider" src/app/layout.tsx` |
| I2 | Iframe de Spotify NUNCA se desmonta, solo CSS | `grep -c "<iframe" src/contexts/SpotifyContext.tsx` ≥1 |
| I3 | Link a registro visible en /juego | `grep -q "registro" src/components/TableroJuego.tsx` |
| I4 | 1 publicada + 3 inéditas por fase | Verificar en game-logic.ts |
| I5 | Texto de Luna intocable ("Ostia Makinas...") | `grep -q "Ostia Makinas" src/app/page.tsx` |

**Verificación automática:** `bash scripts/check-invariants.sh`

---

## 4. FICHEROS PROTEGIDOS — NO REESCRIBIR

Estos ficheros contienen soluciones a bugs críticos. Se pueden editar con `Edit` quirúrgico pero NUNCA reescribir con `Write` sin autorización del usuario.

Ver fichero `.locked-files` para la lista completa.

| Fichero | Líneas | Por qué está protegido |
|---------|--------|------------------------|
| `src/contexts/SpotifyContext.tsx` | 91 | Bug B1: persistencia Spotify |
| `src/app/layout.tsx` | 29 | Invariante I1: SpotifyProvider |
| `src/app/page.tsx` | 223 | Invariante I5: texto de Luna |
| `src/components/TableroJuego.tsx` | 541 | Bugs B3: puntos, validación, fases |
| `src/lib/canciones-data.ts` | 357 | Datos de 15 canciones |
| `src/lib/supabase.ts` | 449 | Auth + persistencia |
| `src/lib/game-logic.ts` | 58 | Invariante I4: lógica de fases |

---

## 5. PROTOCOLO DE INICIO DE SESIÓN

Ejecutar estos pasos EN ORDEN antes de tocar código:

### Paso 1: Leer este fichero (ya lo estás haciendo)

### Paso 2: Ejecutar pre-flight check
```bash
cd luna-cosmic-songs
bash scripts/pre-flight.sh
```
Si falla → resolver ANTES de editar cualquier cosa.

### Paso 3: Montar Obsidian de Luna Ki
```
C:\Users\gines.MINIM\Claude-Cowork\2-Proyectos Luna Ki\1- Luna Ki Obsidian second brain
```
Leer:
1. `Proyectos/1- Luna cosmic songs/1- Aprendizajes/` — TODOS los ficheros
2. `Proyectos/1- Luna cosmic songs/4- Sesiones/` — últimas 2 sesiones

### Paso 4: Verificar invariantes
```bash
bash scripts/check-invariants.sh
```

### Paso 5: Ahora puedes trabajar
Cualquier cambio debe cumplir con las reglas del `.agent-protocol.md`.

---

## 6. REGLAS DE EDICIÓN (resumen rápido)

1. **Edit, nunca Write** — para ficheros existentes, cambio quirúrgico
2. **Verifica integridad antes** — `wc -l` + `tail -5` + comparar con git
3. **No cambies lo que no se pide** — si ves una mejora, proponla primero
4. **Consulta SPEC.md** — sección "No tocar" antes de cada cambio
5. **Un cambio por iteración** — si hay problemas, uno a uno
6. **Documenta bugs resueltos** — inmediatamente en Obsidian/1-Aprendizajes/

---

## 7. STACK TECNOLÓGICO

- **Framework:** Next.js 14 App Router + TypeScript strict
- **Auth + BD:** Supabase (Auth + PostgreSQL)
- **Estilos:** Tailwind CSS
- **Drag & Drop:** @dnd-kit/core + @dnd-kit/sortable
- **Animaciones:** framer-motion
- **Deploy:** Vercel (plan Hobby)

---

## 8. ESTRUCTURA DE FICHEROS CLAVE

```
luna-cosmic-songs/
├── ENTRADA.md            ← ESTE FICHERO (leer primero)
├── .agent-protocol.md    ← Reglas + invariantes + bugs resueltos
├── .locked-files         ← Ficheros protegidos
├── .critical-files.json  ← Hashes SHA256 de ficheros críticos
├── scripts/
│   ├── pre-flight.sh     ← Verificación pre-sesión
│   └── check-invariants.sh ← Tests de invariantes
├── src/
│   ├── app/
│   │   ├── layout.tsx    ← [PROTEGIDO] SpotifyProvider aquí
│   │   ├── page.tsx      ← [PROTEGIDO] Texto de Luna
│   │   ├── juego/page.tsx
│   │   ├── login/page.tsx
│   │   ├── registro/page.tsx
│   │   └── admin/page.tsx
│   ├── components/
│   │   ├── TableroJuego.tsx  ← [PROTEGIDO] Lógica principal del juego
│   │   ├── ColumnaCancion.tsx
│   │   ├── FichaFlotante.tsx
│   │   ├── Particles.tsx
│   │   └── ...
│   ├── contexts/
│   │   └── SpotifyContext.tsx ← [PROTEGIDO] Solución bug B1
│   └── lib/
│       ├── canciones-data.ts ← [PROTEGIDO] 15 canciones
│       ├── game-logic.ts     ← [PROTEGIDO] Fases y validación
│       └── supabase.ts       ← [PROTEGIDO] Auth + BD
├── SPEC.md               ← Especificación funcional
└── package.json
```

---

## 9. DOCUMENTOS RELACIONADOS

- **SPEC.md** — especificación funcional con "No tocar" y log de cambios
- **.agent-protocol.md** — reglas detalladas, invariantes, bugs resueltos
- **Obsidian** — aprendizajes, decisiones, sesiones (requiere montar vault)
- **CLAUDE.md** (carpeta padre) — instrucciones de alto nivel

---

*Este fichero se actualiza al final de cada sesión. Si la fecha de "Última actualización" es de hace más de 1 día, verificar que los datos siguen siendo correctos.*
