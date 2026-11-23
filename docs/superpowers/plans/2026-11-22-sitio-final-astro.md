# Trakas Mexican Food — Sitio final (Astro) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el prototipo estático por un sitio Astro premium, muy rápido, con videos cortos por sección, mascota protagonista y una página `/menu` que se abre al escanear un QR.

**Architecture:** Astro 5 genera HTML estático (casi cero JS). Una sola fuente de datos (`src/data/trakas.ts`) alimenta portada, `/menu` y Schema.org. Videos con carga diferida por IntersectionObserver y pósters como LCP. Despliegue estático en Vercel conectado a GitHub.

**Tech Stack:** Astro 5, TypeScript, CSS propio (tokens de marca), `astro:assets`, `@astrojs/sitemap`, Vitest (lógica), Playwright (e2e/rendimiento), ffmpeg + sharp (media), `qrcode` (QR), Vercel.

**Spec:** este plan + decisiones del cliente (2026-11-22): Astro, Vercel, `/menu` dedicada para QR, material audiovisual aún no está en el PC. Reglas de `CLAUDE.md`. Al ejecutar, Task 1 copia este plan a `docs/superpowers/plans/2026-11-22-sitio-final-astro.md`.

## Global Constraints
- Respuestas al cliente en español, breves, con capturas antes/después.
- Marca intocable: usar tal cual `assets/logo-nuevo/*`, `assets/mascota-oficial/*`, `fonts/TrakasBrush.woff2` (Trakas Brush mínimo 28 px). Nunca redibujar.
- Paleta: `--chile #D62718`, `--fuego #F26A1B`, `--maiz #FFC21A`, `--nopal #1F7A35`, `--ocre #B9782E`, `--comal #141110`, `--tortilla #FFF6E5`.
- WhatsApp `573203172184`; precios COP; horario y menú desde datos, nunca hardcodeado en componentes.
- Rendimiento: Lighthouse móvil ≥ 90 portada, ≥ 95 `/menu`; LCP < 2.5 s; CLS < 0.1; JS portada < 15 KB; `/menu` < 100 KB transferidos; ningún video se descarga antes de entrar en pantalla.
- Video: sin audio, 4–10 s, WebM AV1 + MP4 H.264, 720p y 1080p, ≤ 1.5 MB clip móvil.
- Accesibilidad: respetar `prefers-reduced-motion` y `Save-Data` (solo póster); contraste AA.
- Trabajo por fases: no avanzar a la siguiente sin aprobación del cliente. No sobrescribir trabajo aprobado.
- Todo diseño pasa por el equipo de revisión (director de arte, ilustrador, tipógrafo, marca/web); aprueba con ≥ 8/10 por parte.

## Mapa de skills (obligatorio en cada fase)
| Momento | Skills |
|---|---|
| Diseño de dirección visual (antes de Task 3) | `superpowers:brainstorming`, `frontend-design`, `design-taste-frontend`, `ui-ux-pro-max`, `design-superpowers:creative` |
| Textos (titulares, historia, CTAs, menú) | `copywriting`, `landing-page-copywriter`, `marketing-psychology` (memorabilidad, prueba social), `design:ux-copy`, `humanize-writing` |
| Implementación | `superpowers:subagent-driven-development` o `superpowers:executing-plans`, `superpowers:test-driven-development`, `superpowers:using-git-worktrees` |
| Sistema de diseño / tokens | `ux-design-systems`, `design:design-system` |
| Póster QR de mesa | `logo-design` (pruebas a tamaño pequeño, una tinta), `frontend-design` |
| Revisión de diseño por fase (equipo ≥ 8/10) | `design:design-critique`, `ui-design-review:review` → `ui-design-review:polish`, `design-superpowers:design-review`, `design:accessibility-review` |
| QA en navegador | `run`, `anthropic-skills:built-in-browser`, `gstack` / `agent-browser` (móvil 375 px y escritorio, capturas) |
| Antes de cerrar cada task | `superpowers:verification-before-completion`, `superpowers:requesting-code-review`, `code-review`, `simplify` |
| Fallos | `superpowers:systematic-debugging` |
| Seguridad antes de publicar | `security-review` |
| Publicación | Vercel MCP, `superpowers:finishing-a-development-branch` |
| Memoria del proyecto | `graphify` (actualizar grafo en `memoria/graphify-out/` al cerrar cada fase) |

## Review Focus
1. Horario que cruza medianoche o día cerrado (lunes/martes): el estado debe decir "Cerrado — abrimos miércoles 12:00", no "Abierto". → test en Task 2.
2. Plato con `precio: null` (bebidas): mostrar "Pregunta", nunca "$NaN" ni "$0". → test en Task 2.
3. Celular con ahorro de datos o movimiento reducido: no descargar video, mostrar póster. → test en Task 5.
4. QR escaneado con cámara nativa iOS/Android con parámetros `?utm_source=qr`: debe abrir `/menu` sin redirecciones extra y renderizar sin JS. → test en Task 3.
5. Clip faltante (cliente aún no entrega material): la sección muestra póster de respaldo sin romper el diseño ni dejar huecos. → test en Task 5.

---

## Fase 1 — Base

### Task 1: Migrar a Astro y conservar prototipo

**Files:**
- Move: todo el sitio actual → `prototipo/` (sin publicar)
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `src/layouts/Base.astro`, `src/styles/tokens.css`, `src/styles/global.css`, `public/fonts/TrakasBrush.woff2`, `public/brand/` (copias de logo y mascota oficiales), `docs/superpowers/plans/2026-11-22-sitio-final-astro.md`
- Modify: `.gitignore` (+ `node_modules/`, `dist/`, `.astro/`, `.vercel/`, `media-original/`), `README.md`, `CLAUDE.md` (sección "Estado de las piezas": stack Astro)

**Interfaces:**
- Produces: `Base.astro` props `{ title: string; description: string; image?: string; noIndex?: boolean }`; tokens CSS con los nombres de Global Constraints.

- [ ] Step 1: `npm create astro@latest` (plantilla mínima, TS strict) e instalar `@astrojs/sitemap`, `vitest`, `@playwright/test`.
- [ ] Step 2: Mover prototipo con `git mv` a `prototipo/`; copiar marca a `public/brand/` sin modificar píxeles.
- [ ] Step 3: `Base.astro` con fuentes precargadas (Trakas Brush `font-display: swap`), meta OG con `og-image.jpg`, íconos.
- [ ] Step 4: Verificar: `npm run build` → sin errores; `npm run preview` muestra página vacía con fuente correcta.
- [ ] Step 5: Commit `chore: migrar proyecto a Astro y conservar prototipo`.

### Task 2: Datos del negocio + lógica (TDD)

**Files:**
- Create: `src/data/trakas.ts`, `src/lib/horario.ts`, `src/lib/formato.ts`, `src/lib/schema.ts`, `tests/horario.test.ts`, `tests/formato.test.ts`, `tests/schema.test.ts`

**Interfaces:**
- Consumes: contenido de `prototipo/data/config.js` (copiar valores tal cual).
- Produces:
  - `export const trakas: Negocio` (tipos `Negocio`, `Plato {id,nombre,precio:number|null,desc,destacado?,foto?,video?}`, `Proteina`, `Bebida`, `Franja {dia:0-6,abre:string,cierra:string}`).
  - `estadoHorario(ahora: Date, horario: Franja[]): { abierto: boolean; texto: string }`
  - `formatoPrecio(precio: number | null): string`
  - `whatsappUrl(mensaje?: string): string`
  - `restaurantSchema(n: Negocio): object` (Schema.org Restaurant + Menu)

- [ ] Step 1: Tests:
```ts
expect(formatoPrecio(25000)).toBe('$25.000');
expect(formatoPrecio(null)).toBe('Pregunta');
expect(estadoHorario(new Date('2026-11-23T15:00:00-05:00'), trakas.horario)) // lunes
  .toEqual({ abierto: false, texto: 'Cerrado — abrimos miércoles 12:00' });
expect(estadoHorario(new Date('2026-11-27T22:30:00-05:00'), trakas.horario).abierto).toBe(true); // viernes
expect(whatsappUrl('Hola')).toBe('https://wa.me/573203172184?text=Hola');
expect(restaurantSchema(trakas)['@type']).toBe('Restaurant');
```
- [ ] Step 2: `npx vitest run` → FAIL (módulos no existen).
- [ ] Step 3: Implementar; zona horaria `America/Bogota` vía `Intl.DateTimeFormat`.
- [ ] Step 4: `npx vitest run` → PASS.
- [ ] Step 5: Commit `feat: datos del negocio y lógica de horario/precios`.

## Fase 2 — Menú QR (aprobación del cliente al cerrar)

### Task 3: Página `/menu` ultraligera

**Files:**
- Create: `src/pages/menu.astro`, `src/components/MenuGrid.astro`, `src/components/EstadoHorario.astro`, `src/components/WhatsAppCTA.astro`, `tests/e2e/menu.spec.ts`

**Interfaces:**
- Consumes: `trakas`, `formatoPrecio`, `estadoHorario`, `whatsappUrl`.
- Produces: `MenuGrid` props `{ platos: Plato[]; variante: 'compacta' | 'portada' }` (reutilizado en Task 6).

- [ ] Step 1: e2e: `/menu?utm_source=qr` responde 200 sin redirección; muestra 7 platos y "Pregunta" en bebidas; con JS desactivado los precios siguen visibles; peso total transferido < 100 KB; botón WhatsApp fijo apunta a `wa.me/573203172184`.
- [ ] Step 2: `npx playwright test menu` → FAIL.
- [ ] Step 3: Implementar móvil primero: cabecera con logo + mascota pequeña (`chile-presentando-480.webp`), estado horario, pestañas Platos · Proteínas · Bebidas con anclas CSS (sin JS), foto 480 px lazy por plato (respaldo: sticker de mascota mientras no hay fotos).
- [ ] Step 4: `npx playwright test menu` → PASS; Lighthouse móvil `/menu` ≥ 95.
- [ ] Step 5: Revisión de equipo (skills del mapa) y capturas 375 px. Commit `feat: página de menú para QR`.

### Task 4: Generador de QR + póster de mesa

**Files:**
- Create: `scripts/generar-qr.mjs`, `src/pages/qr-poster.astro` (A6/A5 imprimible, `noIndex`), `public/qr/` (salida), `tests/qr.test.ts`

**Interfaces:**
- Produces: `generarQR(url: string, destino: string): Promise<void>` → `menu-qr.svg`, `menu-qr-2048.png`; nivel de corrección `H`.

- [ ] Step 1: Test: decodificar el PNG generado (`jsqr`) devuelve exactamente `${SITE_URL}/menu?utm_source=qr`.
- [ ] Step 2: Ejecutar → FAIL. Step 3: Implementar con `qrcode`; `SITE_URL` desde `astro.config.mjs` `site`.
- [ ] Step 4: Test PASS; póster con logo, mascota y "Escanea y mira el menú" en Trakas Brush; probar escaneo con 2 celulares reales (iOS y Android).
- [ ] Step 5: Revisión de equipo. Commit `feat: QR del menú y póster de mesa`. **Presentar fase 2 al cliente.**

## Fase 3 — Portada con mascota protagonista (aprobación del cliente)

Antes de codificar: sesión `superpowers:brainstorming` + `frontend-design`/`design-taste-frontend` para fijar dirección visual (2–3 conceptos en capturas), y `copywriting`/`marketing-psychology` para los textos. El cliente elige concepto.

### Task 5: Componente de video diferido + pipeline de media

**Files:**
- Create: `src/components/VideoSection.astro`, `src/scripts/videos.ts`, `scripts/procesar-media.mjs`, `tests/e2e/videos.spec.ts`, `public/videos/.gitkeep`

**Interfaces:**
- Produces: `VideoSection` props `{ clip?: string; poster: ImageMetadata; alt: string; prioridad?: boolean }` (`clip` = nombre base; busca `/videos/{clip}-{720|1080}.{webm|mp4}`). `procesar-media.mjs <entrada> <salida>`: ffmpeg recorte/sin audio/AV1+H.264/720p+1080p + póster AVIF/WebP; sharp para fotos 480/960/1600.

- [ ] Step 1: e2e: al cargar la portada no hay peticiones `.webm/.mp4` hasta hacer scroll a la sección; con `reducedMotion: 'reduce'` nunca se pide video; con `clip` ausente se ve el póster y no hay errores en consola.
- [ ] Step 2: FAIL. Step 3: Implementar (`<video muted playsinline loop preload="none">`, IntersectionObserver asigna `src` y hace play/pause; chequea `navigator.connection.saveData`).
- [ ] Step 4: PASS. Step 5: Commit `feat: video diferido y pipeline de media`.

### Task 6: Secciones de la portada

**Files:**
- Create: `src/pages/index.astro`, `src/components/{Hero,PlatosEstrella,Historia,ConoceAlChile,MascotaGuia,Domicilios,Visitanos,Redes,Footer}.astro`, `src/scripts/mascota-guia.ts`, `tests/e2e/portada.spec.ts`

**Interfaces:**
- Consumes: `VideoSection`, `MenuGrid` (`variante:'portada'`), `EstadoHorario`, `WhatsAppCTA`, `restaurantSchema`.

Orden: Hero (video + mascota "presentando" con entrada en rebote, titular Trakas Brush, CTAs Ver menú / WhatsApp) → Platos estrella (clips por plato, mascota "taco") → Historia/el lugar (galería) → Conoce al Chile (sección propia de la mascota: poses, personalidad, stickers) → Menú resumen → Domicilios (mascota "moto") → Visítanos (mapa cargado al clic, horario) → Redes → Footer (mascota "emblema"). `MascotaGuia`: mascota pequeña fija que cambia de pose por sección (oculta en reduced-motion). Animaciones con `animation-timeline: view()` + respaldo IntersectionObserver.

- [ ] Step 1: e2e: hero LCP es el póster (no video); existen anclas `#menu`, `#nosotros`, `#ubicacion`; JSON-LD válido presente; botón "Ver menú" lleva a `/menu`; sin desplazamiento horizontal a 375 px.
- [ ] Step 2: FAIL. Step 3: Implementar sección por sección con material de muestra (pósters de mascota) mientras no hay tomas.
- [ ] Step 4: PASS; Lighthouse móvil ≥ 90, CLS < 0.1; `design:accessibility-review`.
- [ ] Step 5: Equipo de revisión ≥ 8/10, capturas móvil/escritorio. Commit `feat: portada con mascota protagonista`. **Presentar fase 3 al cliente.**

## Fase 4 — Contenido real (cuando el cliente copie las tomas a `media-original/`)

### Task 7: Selección e integración del material

- [ ] Step 1: Correr `node scripts/procesar-media.mjs media-original public/videos` (y fotos a `src/assets/fotos/`).
- [ ] Step 2: Generar hoja de contacto (miniaturas numeradas) para que el cliente elija clips/fotos por sección.
- [ ] Step 3: Asignar `video`/`foto` en `trakas.ts` y props `clip` en secciones.
- [ ] Step 4: Re-ejecutar Vitest + Playwright + Lighthouse (umbrales de Global Constraints).
- [ ] Step 5: Revisión de equipo; commit `feat: integrar tomas reales`. **Presentar al cliente.**

## Fase 5 — Publicación

### Task 8: Vercel + QR final
- [ ] Step 1: `security-review` y `code-review` de la rama.
- [ ] Step 2: Crear proyecto Vercel conectado a `Diego-8520/trakasMexicanFood` (Vercel MCP; confirmar con el cliente antes de crear).
- [ ] Step 3: Fijar `site` con el dominio (Vercel o propio), regenerar QR (Task 4) y sitemap.
- [ ] Step 4: Verificar en producción: `/menu` desde QR en celular real, Lighthouse, Rich Results Test.
- [ ] Step 5: `superpowers:finishing-a-development-branch`; actualizar `memoria/historial-proyecto.md` y grafo con `graphify`.

## Pendientes del cliente
- Copiar videos e imágenes a `media-original/` (Fase 4).
- Dominio, dirección, horario confirmado, redes reales, precios de bebidas.
