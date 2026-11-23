// Procesa las tomas del cliente para la web.
//   node scripts/procesar-media.mjs [carpeta-entrada]   (por defecto: media-original/)
// Videos → public/videos/{nombre}-{720|1080}.{webm|mp4} (sin audio, máx. 10 s) + póster en src/assets/posters/
// Fotos  → src/assets/fotos/{nombre}.webp (p. ej. birria.webp, compartir.webp)
// Requiere ffmpeg (variable FFMPEG_PATH o en el PATH).
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readdir, rm, stat } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { basename, extname, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const run = promisify(execFile);
/** ffmpeg: variable FFMPEG_PATH, instalación de winget (Gyan.FFmpeg) o el PATH. */
function buscarFfmpeg() {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  const raiz = process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'Microsoft', 'WinGet', 'Packages');
  if (raiz && existsSync(raiz)) {
    for (const pkg of readdirSync(raiz).filter((d) => d.startsWith('Gyan.FFmpeg'))) {
      for (const sub of readdirSync(join(raiz, pkg))) {
        const exe = join(raiz, pkg, sub, 'bin', 'ffmpeg.exe');
        if (existsSync(exe)) return exe;
      }
    }
  }
  return 'ffmpeg';
}
export const FFMPEG = buscarFfmpeg();
export const FFPROBE = process.env.FFPROBE_PATH || FFMPEG.replace(/ffmpeg(\.exe)?$/i, (_m, exe) => `ffprobe${exe || ''}`);

const DURACION_MAX = 10;   // segundos
const VIDEO = /\.(mp4|mov|m4v|webm|mkv|avi)$/i;
const FOTO = /\.(jpe?g|png|webp|heic|tiff?)$/i;

// Calidad y techo de bitrate por resolución (720p ≤ ~1.4 MB en 10 s)
const PERFILES = {
  720:  { crf264: 28, max264: '1000k', crfAv1: 42, maxAv1: 900 },
  1080: { crf264: 26, max264: '2400k', crfAv1: 38, maxAv1: 2000 },
};

/** "Toma Birria 01.mov" → "toma-birria-01" */
export const slug = (archivo) => basename(archivo, extname(archivo))
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Duración máxima por clip (segundos); null = sin recorte. El hero se usa completo (petición del cliente).
const DURACION_POR_CLIP = { hero: null };
// Segundo del póster por clip (por defecto 0.3 s). En el hero, 0.3 s sale movido.
const POSTER_SEG = { hero: 15.5 };

// HDR (HLG/PQ del iPhone) → SDR bt709; sin esto los colores salen grises/lavados en el navegador.
const SDR = 'zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,';
const COLOR_709 = ['-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709'];
async function esHdr(entrada) {
  const { stdout } = await run(FFPROBE, ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=color_transfer', '-of', 'csv=p=0', entrada]);
  return /arib-std-b67|smpte2084/.test(stdout);
}

// Lado corto a `lado` px (sirve para tomas horizontales y verticales), dimensiones pares, máx. 30 fps
const filtro = (lado, hdr = false) =>
  `${hdr ? SDR : ''}scale='if(gt(iw,ih),-2,${lado})':'if(gt(iw,ih),${lado},-2)':flags=lanczos,fps='min(30,source_fps)',format=yuv420p`;

export async function procesarVideo(entrada, salida, { salidaPoster = salida } = {}) {
  await mkdir(salida, { recursive: true });
  await mkdir(salidaPoster, { recursive: true });
  const nombre = slug(entrada);
  const hdr = await esHdr(entrada);
  const max = nombre in DURACION_POR_CLIP ? DURACION_POR_CLIP[nombre] : DURACION_MAX;
  const comunes = ['-y', '-hide_banner', '-loglevel', 'error', '-i', entrada, ...(max ? ['-t', String(max)] : []), '-an', '-map_metadata', '-1', ...COLOR_709];

  for (const [lado, p] of Object.entries(PERFILES)) {
    await run(FFMPEG, [...comunes, '-vf', filtro(lado, hdr),
      '-c:v', 'libx264', '-preset', 'slow', '-profile:v', 'high', '-crf', String(p.crf264),
      '-maxrate', p.max264, '-bufsize', String(parseInt(p.max264) * 2) + 'k',
      '-movflags', '+faststart', join(salida, `${nombre}-${lado}.mp4`)]);
    await run(FFMPEG, [...comunes, '-vf', filtro(lado, hdr),
      '-c:v', 'libsvtav1', '-preset', '6', '-crf', String(p.crfAv1), '-svtav1-params', `mbr=${p.maxAv1}`,
      join(salida, `${nombre}-${lado}.webm`)]);
  }

  // Póster: primer fotograma nítido (0.3 s) a 1080 px de lado corto
  const png = join(salidaPoster, `${nombre}-poster.tmp.png`);
  await run(FFMPEG, ['-y', '-hide_banner', '-loglevel', 'error', '-ss', String(POSTER_SEG[nombre] ?? 0.3), '-i', entrada, '-frames:v', '1', '-vf', filtro(1080, hdr), png]);
  await sharp(png).webp({ quality: 80 }).toFile(join(salidaPoster, `${nombre}-poster.webp`));
  await rm(png);
  return nombre;
}

/** Foto → una sola WebP (lado mayor ≤ 2000 px, orientación corregida, sin metadatos). Astro genera los tamaños. */
export async function procesarFoto(entrada, salida) {
  await mkdir(salida, { recursive: true });
  const nombre = slug(entrada);
  await sharp(entrada).rotate()
    .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(join(salida, `${nombre}.webp`));
  return nombre;
}

// CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
  const carpeta = process.argv[2] || join(raiz, 'media-original');
  const archivos = (await readdir(carpeta, { recursive: true })).map((f) => join(carpeta, f));
  for (const f of archivos) {
    if (!(await stat(f)).isFile()) continue;
    if (VIDEO.test(f)) {
      const n = await procesarVideo(f, join(raiz, 'public/videos'), { salidaPoster: join(raiz, 'src/assets/posters') });
      console.log(`🎬 ${n}`);
    } else if (FOTO.test(f)) {
      console.log(`📷 ${await procesarFoto(f, join(raiz, 'src/assets/fotos'))}`);
    }
  }
}
