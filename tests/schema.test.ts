import { describe, it, expect } from 'vitest';
import { restaurantSchema } from '../src/lib/schema';
import { trakas } from '../src/data/trakas';

describe('restaurantSchema', () => {
  const s = restaurantSchema(trakas) as any;
  it('es un Restaurant con nombre y teléfono', () => {
    expect(s['@type']).toBe('Restaurant');
    expect(s.name).toBe('Trakas Mexican Food');
    expect(s.telephone).toBe('+573203172184');
  });
  it('incluye menú con los 7 platos y precio en COP', () => {
    const items = s.hasMenu.hasMenuSection[0].hasMenuItem;
    expect(items).toHaveLength(7);
    expect(items[0].offers).toEqual({ '@type': 'Offer', price: 25000, priceCurrency: 'COP' });
  });
  it('omite offers en bebidas sin precio', () => {
    const bebidas = s.hasMenu.hasMenuSection[1].hasMenuItem;
    expect(bebidas[0].offers).toBeUndefined();
  });
  it('horario con días en inglés de schema.org', () => {
    expect(s.openingHoursSpecification[0]).toEqual({ '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '12:00', closes: '22:00' });
  });
});
