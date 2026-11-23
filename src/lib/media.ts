import type { ImageMetadata } from 'astro';

// Archivos que genera scripts/procesar-media.mjs (npm run media) a partir de media-original/:
//   pósters de video → src/assets/posters/{clip}-poster.webp
//   fotos           → src/assets/fotos/{nombre}.webp
type Modulo = { default: ImageMetadata };
const posters = import.meta.glob<Modulo>('../assets/posters/*-poster.webp', { eager: true });
const fotos = import.meta.glob<Modulo>('../assets/fotos/*.webp', { eager: true });

/** Póster del clip `nombre` (p. ej. "hero", "birria"), o undefined si aún no se ha procesado. */
export const posterDe = (nombre: string): ImageMetadata | undefined =>
  posters[`../assets/posters/${nombre}-poster.webp`]?.default;

/** Foto `nombre` (p. ej. id de un plato o "compartir"), o undefined si aún no existe. */
export const fotoDe = (nombre: string): ImageMetadata | undefined =>
  fotos[`../assets/fotos/${nombre}.webp`]?.default;
