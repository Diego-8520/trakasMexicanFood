import { describe, it, expect, beforeAll } from 'vitest';
import { mkdtempSync, statSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { procesarVideo, procesarFoto, FFMPEG, FFPROBE } from '../scripts/procesar-media.mjs';

const probe = (f: string) => JSON.parse(execFileSync(FFPROBE, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', f]).toString());

describe('procesar-media', () => {
  const dir = mkdtempSync(join(tmpdir(), 'media-'));
  const entrada = join(dir, 'Toma Birria 01.mov');
  const salida = join(dir, 'out');

  beforeAll(async () => {
    // toma de prueba: 14 s, 1920x1080 con audio (como un celular)
    execFileSync(FFMPEG, ['-y', '-f', 'lavfi', '-i', 'testsrc2=size=1920x1080:rate=30', '-f', 'lavfi', '-i', 'sine=frequency=440',
      '-t', '14', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', entrada], { stdio: 'ignore' });
    await procesarVideo(entrada, salida);
  }, 300_000);

  it('nombra la salida en minúsculas sin espacios', () => {
    expect(existsSync(join(salida, 'toma-birria-01-720.mp4'))).toBe(true);
  });

  it('crea WebM AV1 y MP4 H.264 en 720p y 1080p, más póster', () => {
    for (const r of ['720', '1080']) {
      expect(probe(join(salida, `toma-birria-01-${r}.webm`)).streams[0].codec_name).toBe('av1');
      expect(probe(join(salida, `toma-birria-01-${r}.mp4`)).streams[0].codec_name).toBe('h264');
    }
    expect(probe(join(salida, 'toma-birria-01-720.mp4')).streams[0].height).toBe(720);
    expect(existsSync(join(salida, 'toma-birria-01-poster.webp'))).toBe(true);
  });

  it('quita el audio y recorta a 10 s como máximo', () => {
    const p = probe(join(salida, 'toma-birria-01-720.mp4'));
    expect(p.streams.filter((s: any) => s.codec_type === 'audio')).toHaveLength(0);
    expect(Number(p.format.duration)).toBeLessThanOrEqual(10.1);
  });

  it('el clip móvil pesa 1.5 MB o menos', () => {
    expect(statSync(join(salida, 'toma-birria-01-720.mp4')).size).toBeLessThanOrEqual(1.5 * 1024 * 1024);
    expect(statSync(join(salida, 'toma-birria-01-720.webm')).size).toBeLessThanOrEqual(1.5 * 1024 * 1024);
  });

  it('fotos: WebP y AVIF en 480, 960 y 1600 px', async () => {
    const foto = join(dir, 'Foto Local.jpg');
    execFileSync(FFMPEG, ['-y', '-f', 'lavfi', '-i', 'testsrc2=size=3000x2000', '-frames:v', '1', foto], { stdio: 'ignore' });
    await procesarFoto(foto, salida);
    for (const w of [480, 960, 1600]) for (const ext of ['webp', 'avif'])
      expect(existsSync(join(salida, `foto-local-${w}.${ext}`))).toBe(true);
  });
});
