import { describe, it, expect } from 'vitest';
import { formatoPrecio, whatsappUrl } from '../src/lib/formato';

describe('formatoPrecio', () => {
  it('formatea pesos colombianos con punto de miles', () => {
    expect(formatoPrecio(25000)).toBe('$25.000');
  });
  it('precio 0 (sin definir) también muestra "Pregunta"', () => {
    expect(formatoPrecio(0)).toBe('Pregunta');
  });
  it('muestra "Pregunta" cuando el precio es null', () => {
    expect(formatoPrecio(null)).toBe('Pregunta');
  });
});

describe('whatsappUrl', () => {
  it('construye enlace wa.me con el número del negocio', () => {
    expect(whatsappUrl('Hola')).toBe('https://wa.me/573203172184?text=Hola');
  });
  it('codifica espacios y acentos del mensaje', () => {
    expect(whatsappUrl('Quiero birria ñam')).toBe('https://wa.me/573203172184?text=Quiero%20birria%20%C3%B1am');
  });
  it('sin mensaje devuelve solo el número', () => {
    expect(whatsappUrl()).toBe('https://wa.me/573203172184');
  });
});
