// Vuelve transparentes los huecos cerrados que quedaron blancos al recortar la mascota
// (los originales del cliente son JPG con fondo blanco). Solo toca las islas indicadas:
// guantes, zapatillas, dientes y brillos blancos no cambian.
//
//   node scripts/limpiar-huecos.mjs
//
// Lee     marca/mascota/v1-con-huecos/chile-{pose}.png | -sticker.webp   (recortes originales, no se tocan)
// Escribe marca/mascota/chile-{pose}.png | -sticker.webp                 (masters corregidos)
//         src/assets/brand/mascota/…                                       (copias que usa la página, si existen)
import sharp from 'sharp';
import { copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** Un punto dentro de cada hueco, en coordenadas de la imagen de 2000 px. */
export const HUECOS = {
  presentando: [[1128, 1300]],                                                    // entre brazo en jarra y cuerpo
  fuego: [[1212, 1300]],                                                          // ídem
  moto: [[700, 1350], [700, 1580], [880, 1590], [1470, 1405], [730, 1160]],       // espacios de la moto
};

const esBlanco = (d, i, umbral) => d[i + 3] > 0 && Math.min(d[i], d[i + 1], d[i + 2]) > umbral;
const esGris = (d, i) => Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]) < 50;

/** Rellena (flood fill) desde cada semilla y deja esos píxeles transparentes; limpia el borde antialias. */
export async function limpiar(entrada, salida, semillas) {
  const { data, info } = await sharp(entrada).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const hueco = new Uint8Array(W * H);

  for (const [sx, sy] of semillas) {
    const p0 = sy * W + sx;
    if (!esBlanco(data, p0 * 4, 235)) throw new Error(`La semilla ${sx},${sy} no está en un hueco blanco`);
    const pila = [p0];
    hueco[p0] = 1;
    while (pila.length) {
      const q = pila.pop(), x = q % W;
      for (const r of [q - 1, q + 1, q - W, q + W]) {
        if (r < 0 || r >= W * H || hueco[r] || Math.abs((r % W) - x) > 1) continue;
        if (esBlanco(data, r * 4, 200) && esGris(data, r * 4)) { hueco[r] = 1; pila.push(r); }
      }
    }
  }

  // Anillo de 3 px alrededor del hueco: los grises son mezcla de contorno negro + blanco → quitar el blanco
  const anillo = new Uint8Array(W * H);
  let frente = [];
  for (let p = 0; p < W * H; p++) if (hueco[p]) frente.push(p);
  for (let paso = 0; paso < 3; paso++) {
    const siguiente = [];
    for (const q of frente) for (const r of [q - 1, q + 1, q - W, q + W]) {
      if (r < 0 || r >= W * H || hueco[r] || anillo[r]) continue;
      anillo[r] = 1;
      siguiente.push(r);
    }
    frente = siguiente;
  }

  let n = 0;
  for (let p = 0; p < W * H; p++) {
    const i = p * 4;
    if (hueco[p]) { data[i + 3] = 0; n++; continue; }
    const claro = Math.min(data[i], data[i + 1], data[i + 2]);
    if (anillo[p] && esGris(data, i) && claro > 25) {
      data[i + 3] = Math.round(data[i + 3] * (1 - claro / 255));
      data[i] = data[i + 1] = data[i + 2] = 20; // color del contorno
    }
  }

  const img = sharp(data, { raw: { width: W, height: H, channels: 4 } });
  await (salida.endsWith('.webp') ? img.webp({ quality: 90, alphaQuality: 100 }) : img.png({ compressionLevel: 9 })).toFile(salida);
  return n;
}

// CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  for (const [pose, semillas] of Object.entries(HUECOS)) {
    for (const archivo of [`chile-${pose}.png`, `chile-${pose}-sticker.webp`]) {
      const entrada = `marca/mascota/v1-con-huecos/${archivo}`;
      if (!existsSync(entrada)) continue;
      const { width } = await sharp(entrada).metadata();
      const k = width / 2000;
      const n = await limpiar(entrada, `marca/mascota/${archivo}`, semillas.map(([x, y]) => [Math.round(x * k), Math.round(y * k)]));
      const copia = `src/assets/brand/mascota/${archivo}`;
      if (existsSync(copia)) await copyFile(`marca/mascota/${archivo}`, copia);
      console.log(`${archivo}: ${n} píxeles → transparentes`);
    }
  }
}
