import { describe, it, expect } from 'vitest';
import { estadoHorario } from '../src/lib/horario';
import { trakas } from '../src/data/trakas';

describe('estadoHorario', () => {
  it('lunes: cerrado y anuncia apertura del miércoles', () => {
    expect(estadoHorario(new Date('2026-11-23T15:00:00-05:00'), trakas.horario))
      .toEqual({ abierto: false, texto: 'Cerrado — abrimos miércoles 12:00' });
  });
  it('viernes 22:30: abierto (cierra 23:00)', () => {
    const e = estadoHorario(new Date('2026-11-27T22:30:00-05:00'), trakas.horario);
    expect(e.abierto).toBe(true);
    expect(e.texto).toBe('Abierto — cerramos a las 23:00');
  });
  it('miércoles antes de abrir: anuncia apertura de hoy', () => {
    expect(estadoHorario(new Date('2026-11-25T09:00:00-05:00'), trakas.horario))
      .toEqual({ abierto: false, texto: 'Cerrado — abrimos hoy 12:00' });
  });
  it('domingo después de cerrar: siguiente apertura es miércoles', () => {
    expect(estadoHorario(new Date('2026-11-29T21:30:00-05:00'), trakas.horario))
      .toEqual({ abierto: false, texto: 'Cerrado — abrimos miércoles 12:00' });
  });
  it('usa hora de Bogotá aunque la fecha venga en UTC', () => {
    // 2026-11-28T03:30Z = viernes 22:30 en Bogotá
    expect(estadoHorario(new Date('2026-11-28T03:30:00Z'), trakas.horario).abierto).toBe(true);
  });
  it('franja que cruza medianoche sigue abierta después de las 00:00', () => {
    const h = [{ dia: 5, abre: '18:00', cierra: '02:00' }];
    // sábado 01:00 Bogotá pertenece a la franja del viernes
    expect(estadoHorario(new Date('2026-11-28T01:00:00-05:00'), h).abierto).toBe(true);
  });
});

import { resumenHorario } from '../src/lib/horario';
describe('resumenHorario', () => {
  it('resume el horario actual a partir de los datos', () => {
    expect(resumenHorario(trakas.horario)).toBe('Miércoles a domingo desde las 12:00');
  });
  it('se actualiza si cambian los días', () => {
    const h = [4, 5, 6, 0].map((dia) => ({ dia, abre: '13:00', cierra: '22:00' }));
    expect(resumenHorario(h)).toBe('Jueves a domingo desde las 13:00');
  });
});
