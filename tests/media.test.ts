import { describe, it, expect } from 'vitest';
import { posterDe, fotoDe } from '../src/lib/media';

describe('media', () => {
  it('posterDe encuentra el póster de un clip procesado', () => {
    expect(posterDe('chile-zoom')).toBeTruthy();
  });
  it('posterDe devuelve undefined si el clip no existe', () => {
    expect(posterDe('no-existe')).toBeUndefined();
  });
  it('fotoDe devuelve undefined si la foto aún no existe', () => {
    expect(fotoDe('birria')).toBeUndefined();
  });
});
