# Trakas Mexican Food — sitio web

Sitio en **Astro 5**: HTML estático, casi sin JavaScript (≈3 KB en la portada), pensado para cargar rápido con videos cortos.
Diseño aprobado: concepto **B "Cine de comal"** con la cinta roja en movimiento.

## Comandos
```bash
npm install          # una vez
npm run dev          # servidor local en http://localhost:4321
npm run build        # genera dist/
npm run preview      # sirve dist/
npm test             # pruebas de lógica y de procesamiento de medios (Vitest)
npm run test:e2e     # construye y prueba en navegador móvil (Playwright)
npm run media        # procesa videos y fotos de media-original/
npm run qr           # genera el QR del menú en public/qr/
```
Requisitos: Node 20+ y ffmpeg (`winget install Gyan.FFmpeg`) para `npm run media`.

## Páginas
| Ruta | Qué es |
|---|---|
| `/` | Portada: hero con video, carta por capítulos, El Chile, Nosotros, Domicilios, Visítanos |
| `/menu` | Menú ligero (< 100 KB) que abre el QR de las mesas |
| `/qr-poster` | Tarjeta de mesa A6 imprimible con el QR (no indexada) |

## Estructura
```
marca/                    Archivos maestros de la marca (no se publican)
  originales-cliente/     Imágenes originales entregadas por el cliente
  logo/                   Masters del logo (logo-trakas-master-v2.png es el vigente)
  mascota/                Chile en sus 5 poses, con los huecos ya transparentes
    v1-con-huecos/        Recortes anteriores (historial)
  fuente/                 Trakas Brush (TTF y WOFF2)
media-original/           Videos y fotos crudos del cliente (no se suben a GitHub)
public/                   Archivos servidos tal cual: íconos, fuente, QR, videos procesados
src/
  assets/brand/           Copias exactas de la marca que usa la página
  assets/posters/         Pósters de video (generados por npm run media)
  assets/fotos/           Fotos procesadas (generadas por npm run media)
  components/             Componentes compartidos (menú, horario, WhatsApp, video)
  components/portada/     Secciones de la portada
  data/trakas.ts          Datos del negocio y menú (fuente única)
  lib/                    Lógica: horario, precios, Schema.org, medios
  layouts/ pages/ scripts/ styles/
scripts/                  procesar-media, generar-qr, limpiar-huecos
tests/                    Vitest (lógica) y tests/e2e (Playwright)
docs/                     Plan, guion visual de videos (GUIA-VIDEOS.md), capturas
```

## Dónde se cambia cada cosa
- **Datos del negocio, menú y precios:** `src/data/trakas.ts`. Lo que tenga `[corchetes]` no se muestra al público hasta completarlo.
- **Mensaje de marca** (promesa, pilares de Nosotros, frases de la cinta, mensajes de WhatsApp): bloque `marca` en `src/data/trakas.ts`. Idea central: *birria en consomé y tortillas artesanales, al comal cuando pides*.
- **Dominio:** `SITE_URL` en `astro.config.mjs`; después `npm run qr`.
- **Colores y tipografías:** `src/styles/tokens.css`.

## Videos y fotos
Ver el guion visual en [`docs/GUIA-VIDEOS.md`](docs/GUIA-VIDEOS.md). Copiar los archivos en `media-original/` con su nombre y ejecutar `npm run media`:

| Archivo | Aparece en |
|---|---|
| `hero.mp4` | Fondo de la portada |
| `birria.mp4`, `ramen.mp4`, `volcanes.mp4`, `gringas.mp4` | Tarjetas de la carta |
| `chile.mp4` | Sección El Chile (reemplaza el clip de muestra) |
| `{id}.jpg` (birria, burrito, chilaquiles, ramen, dorilocos, volcanes, gringas) | Miniatura en `/menu` y respaldo de la tarjeta |
| `compartir.jpg` | Imagen al compartir el enlace (si no existe se usa `public/og-image.jpg`) |

Los videos se descargan solo cuando su sección aparece en pantalla, y nunca con ahorro de datos o movimiento reducido. Lo que falte se ve como ahora, sin huecos ni errores.

## Publicación
Vercel conectado a este repositorio: cada push a `main` publica en https://trakas-mexican-food.vercel.app.
