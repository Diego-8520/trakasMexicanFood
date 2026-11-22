# Trakas Mexican Food — sitio web

Sitio en **Astro 5** (HTML estático, casi sin JavaScript) pensado para cargar muy rápido con videos cortos.
El prototipo anterior queda como referencia en `prototipo/` (no se publica).

## Comandos
```bash
npm install          # una vez
npm run dev          # servidor local en http://localhost:4321
npm run build        # genera dist/
npm test             # pruebas de lógica (Vitest)
npm run test:e2e     # pruebas en navegador (Playwright)
npm run qr           # genera el QR del menú en public/qr/
```

## Dónde se cambia cada cosa
- **Datos del negocio y menú:** `src/data/trakas.ts` (un solo archivo; portada, `/menu` y Google se actualizan solos).
- **Dominio:** `SITE_URL` en `astro.config.mjs` (después: `npm run qr` para regenerar el QR).
- **Colores y tipografías:** `src/styles/tokens.css`.
- **Marca (no modificar):** `src/assets/brand/logo/`, `src/assets/brand/mascota/`, `public/fonts/TrakasBrush.woff2`.

## Páginas
- `/` portada.
- `/menu` menú ligero que abre el QR de las mesas.
- `/qr-poster` póster imprimible con el QR (no aparece en Google).

## Videos y fotos
Copiar las tomas originales a `media-original/` (no se suben a GitHub) y ejecutar `npm run media`.
Requiere ffmpeg (`winget install Gyan.FFmpeg`). Resultado: videos en `public/videos/` (AV1 + H.264, 720p/1080p, sin audio, máx. 10 s), pósters en `src/assets/posters/`, fotos en `src/assets/fotos/`.
En una sección: `<VideoSection clip="nombre" poster={...} alt="..." />`. Si el clip no existe, se ve solo el póster.

## Publicación
Vercel, conectado al repositorio de GitHub: cada push a `main` publica.
