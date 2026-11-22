import type { ImageMetadata } from 'astro';

// Pósters que genera scripts/procesar-media.mjs: src/assets/posters/{clip}-poster.webp
const posters = import.meta.glob<{ default: ImageMetadata }>('../assets/posters/*-poster.webp', { eager: true });

/** Póster del clip `nombre` (p. ej. "hero", "birria"), o undefined si aún no se ha procesado. */
export function posterDe(nombre: string): ImageMetadata | undefined {
  return posters[`../assets/posters/${nombre}-poster.webp`]?.default;
}
