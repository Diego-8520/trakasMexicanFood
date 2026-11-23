import { describe, it, expect, beforeAll } from 'vitest';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
import { generarQR, urlMenuQR } from '../scripts/generar-qr.mjs';
import { SITE_URL } from '../astro.config.mjs';

describe('generarQR', () => {
  const dir = mkdtempSync(join(tmpdir(), 'qr-'));
  const url = urlMenuQR(SITE_URL);
  beforeAll(async () => { await generarQR(url, dir); });

  it('la URL del QR apunta a /menu con utm_source=qr', () => {
    expect(url).toBe(`${SITE_URL}/menu?utm_source=qr`);
  });
  it('crea SVG y PNG de imprenta (≥ 2000 px)', () => {
    expect(existsSync(join(dir, 'menu-qr.svg'))).toBe(true);
    const png = PNG.sync.read(readFileSync(join(dir, 'menu-qr-2048.png')));
    expect(png.width).toBeGreaterThanOrEqual(2000); // qrcode redondea al módulo entero
  });
  it('zona de silencio de al menos 4 módulos (estándar para imprenta)', () => {
    const png = PNG.sync.read(readFileSync(join(dir, 'menu-qr-2048.png')));
    // primera fila con un píxel oscuro = margen superior en píxeles
    let y = 0;
    outer: for (; y < png.height; y++) for (let x = 0; x < png.width; x++) if (png.data[(y * png.width + x) * 4] < 128) break outer;
    const r = jsQR(new Uint8ClampedArray(png.data), png.width, png.height)!;
    const modulo = (r.location.topRightCorner.x - r.location.topLeftCorner.x) / (r.version * 4 + 17);
    expect(y / modulo).toBeGreaterThanOrEqual(3.9);
  });
  it('el PNG se decodifica exactamente a la URL del menú', () => {
    const png = PNG.sync.read(readFileSync(join(dir, 'menu-qr-2048.png')));
    const r = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
    expect(r?.data).toBe(url);
  });
});
