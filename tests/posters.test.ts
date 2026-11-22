import { describe, it, expect } from 'vitest';
import { posterDe } from '../src/lib/posters';

describe('posterDe', () => {
  it('encuentra el póster generado por procesar-media para un clip', () => {
    expect(posterDe('chile-zoom')).toBeTruthy();
  });
  it('devuelve undefined si el clip aún no existe', () => {
    expect(posterDe('birria-que-no-existe')).toBeUndefined();
  });
});
