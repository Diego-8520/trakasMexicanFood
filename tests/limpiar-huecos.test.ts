import { describe, it, expect, beforeAll } from 'vitest';
import sharp from 'sharp';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { limpiar, HUECOS } from '../scripts/limpiar-huecos.mjs';

const px = async (f: string, x: number, y: number) => {
  const { data, info } = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const i = (y * info.width + x) * 4;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
};

describe('limpiar-huecos (chile presentando)', () => {
  const orig = 'prototipo/assets/mascota-oficial/chile-presentando.png';
  const out = join(mkdtempSync(join(tmpdir(), 'hueco-')), 'p.png');
  beforeAll(async () => { await limpiar(orig, out, HUECOS.presentando); }, 60_000);

  it('el hueco entre brazo y cuerpo queda transparente', async () => {
    expect((await px(orig, 1128, 1300))[3]).toBeGreaterThan(200); // antes: blanco opaco
    expect((await px(out, 1128, 1300))[3]).toBe(0);
  });
  it('el guante blanco no cambia', async () => {
    expect(await px(out, 1020, 1430)).toEqual(await px(orig, 1020, 1430));
  });
  it('el brazo rojo no cambia', async () => {
    expect(await px(out, 1180, 1200)).toEqual(await px(orig, 1180, 1200));
  });
});
