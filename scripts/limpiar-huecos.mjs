// Vuelve transparentes los huecos cerrados que quedaron blancos al recortar la mascota
// (los originales del cliente son JPG con fondo blanco). Solo toca las islas indicadas:
// guantes, zapatillas, dientes y brillos blancos no se modifican.
//   node scripts/limpiar-huecos.mjs
// Lee   prototipo/assets/mascota-oficial/chile-{pose}.png   (originales, no se sobrescriben)
// Escribe prototipo/assets/mascota-oficial/chile-{pose}-v2.png y la copia del sitio en src/assets/brand/mascota/chile-{pose}.png
import sharp from 'sharp';
import { copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

// Un punto dentro de cada hueco (coordenadas en la imagen de 2000 px)
export const HUECOS = {
  presentando: [[1128, 1300]],              // entre el brazo en jarra y el cuerpo
  fuego: [[1212, 1300]],                    // ídem
  moto: [[700, 1350], [700, 1580], [880, 1590], [1470, 1405], [730, 1160]], // entre escudo, piernas y piso de la moto
};

const esBlanco = (d, i, umbral) => d[i + 3] > 0 && Math.min(d[i], d[i + 1], d[i + 2]) > umbral;
const esGris = (d, i) => Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]) < 50;

export async function limpiar(entrada, salida, semillas) {
  const { data, info } = await sharp(entrada).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const hueco = new Uint8Array(W * H);

  for (const [sx, sy] of semillas) {
    const p0 = sy * W + sx;
    if (!esBlanco(data, p0 * 4, 235)) throw new Error(`La semilla ${sx},${sy} no está en un hueco blanco`);
    const pila = [p0]; hueco[p0] = 1;
    while (pila.length) {
      const q = pila.pop(), x = q % W;
      for (const r of [q - 1, q + 1, q - W, q + W]) {
        if (r < 0 || r >= W * H || hueco[r] || Math.abs((r % W) - x) > 1) continue;
        if (esBlanco(data, r * 4, 200) && esGris(data, r * 4)) { hueco[r] = 1; pila.push(r); }
      }
    }
  }

  // Borde: píxeles grises junto al hueco son mezcla de contorno negro + fondo blanco → quitar el blanco
  const anillo = new Uint8Array(W * H);
  let frente = []; for (let p = 0; p < W * H; p++) if (hueco[p]) frente.push(p);
  for (let paso = 0; paso < 3; paso++) {
    const sig = [];
    for (const q of frente) for (const r of [q - 1, q + 1, q - W, q + W]) {
      if (r < 0 || r >= W * H || hueco[r] || anillo[r]) continue;
      anillo[r] = 1; sig.push(r);
    }
    frente = sig;
  }

  let n = 0;
  for (let p = 0; p < W * H; p++) {
    const i = p * 4;
    if (hueco[p]) { data[i + 3] = 0; n++; continue; }
    if (anillo[p] && esGris(data, i) && Math.min(data[i], data[i + 1], data[i + 2]) > 25) {
      const claro = Math.min(data[i], data[i + 1], data[i + 2]) / 255; // 0 = negro puro, 1 = blanco
      data[i + 3] = Math.round(data[i + 3] * (1 - claro));
      data[i] = data[i + 1] = data[i + 2] = 20; // color del contorno
    }
  }
  const img = sharp(data, { raw: { width: W, height: H, channels: 4 } });
  await (salida.endsWith('.webp') ? img.webp({ quality: 90, alphaQuality: 100 }) : img.png({ compressionLevel: 9 })).toFile(salida);
  return n;
}

if (process.argv[1]?.endsWith('limpiar-huecos.mjs')) {
  for (const [pose, semillas] of Object.entries(HUECOS)) {
    const orig = `prototipo/assets/mascota-oficial/chile-${pose}.png`;
    const v2 = `prototipo/assets/mascota-oficial/chile-${pose}-v2.png`;
    const n = await limpiar(orig, v2, semillas);
    await copyFile(v2, `src/assets/brand/mascota/chile-${pose}.png`);
    for (const w of [1024, 480]) await sharp(v2).resize(w).webp({ quality: 85 }).toFile(`src/assets/brand/mascota/chile-${pose}-${w}.webp`).catch(() => {});
    console.log(`${pose}: ${n} píxeles de hueco → transparentes`);

    // Versiones sticker (mismo encuadre, otra resolución): semillas escaladas
    for (const ext of ['png', 'webp']) {
      const nombre = ext === 'png' ? `chile-${pose}-sticker.png` : `chile-${pose}-sticker-1024.webp`;
      const origS = `prototipo/assets/mascota-oficial/${nombre}`;
      if (!existsSync(origS)) continue;
      const { width } = await sharp(origS).metadata();
      const k = width / 2000;
      const v2S = origS.replace(/.(png|webp)$/, '-v2.$1');
      const nS = await limpiar(origS, v2S, semillas.map(([x, y]) => [Math.round(x * k), Math.round(y * k)]));
      await copyFile(v2S, `src/assets/brand/mascota/${nombre}`);
      if (ext === 'webp') await sharp(v2S).resize(480).webp({ quality: 85 }).toFile(`src/assets/brand/mascota/chile-${pose}-sticker-480.webp`).catch(() => {});
      console.log(`  ${nombre}: ${nS} píxeles`);
    }
  }
}
