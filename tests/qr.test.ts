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
  it('crea SVG y PNG de 2048 px', () => {
    expect(existsSync(join(dir, 'menu-qr.svg'))).toBe(true);
    const png = PNG.sync.read(readFileSync(join(dir, 'menu-qr-2048.png')));
    expect(png.width).toBe(2048);
  });
  it('el PNG se decodifica exactamente a la URL del menú', () => {
    const png = PNG.sync.read(readFileSync(join(dir, 'menu-qr-2048.png')));
    const r = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
    expect(r?.data).toBe(url);
  });
});
