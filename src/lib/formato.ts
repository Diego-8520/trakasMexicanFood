import { trakas } from '../data/trakas';

export function formatoPrecio(precio: number | null): string {
  if (precio === null || !Number.isFinite(precio) || precio <= 0) return 'Pregunta';
  return '$' + Math.round(precio).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function whatsappUrl(mensaje?: string): string {
  const base = `https://wa.me/${trakas.whatsapp}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}
