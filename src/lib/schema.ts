import type { Negocio } from '../data/trakas';

const DIAS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const item = (nombre: string, precio: number | null, desc?: string) => ({
  '@type': 'MenuItem',
  name: nombre,
  ...(desc ? { description: desc } : {}),
  ...(precio !== null ? { offers: { '@type': 'Offer', price: precio, priceCurrency: 'COP' } } : {}),
});

export function restaurantSchema(n: Negocio, url?: string): object {
  const sameAs = Object.values(n.redes).filter((u) => u && !u.includes('['));
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: n.nombre,
    alternateName: n.nombresAlternos,
    ...(url ? { url, menu: new URL('/menu', url).href } : {}),
    telephone: `+${n.whatsapp}`,
    servesCuisine: ['Mexicana', 'Tacos', 'Birria'],
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: n.direccion.calle,
      addressLocality: n.direccion.ciudad,
      addressRegion: n.direccion.departamento,
      postalCode: n.direccion.codigoPostal,
      addressCountry: n.direccion.pais,
    },
    geo: { '@type': 'GeoCoordinates', latitude: n.geo.lat, longitude: n.geo.lng },
    openingHoursSpecification: n.horario.map((f) => ({
      '@type': 'OpeningHoursSpecification', dayOfWeek: DIAS_EN[f.dia], opens: f.abre, closes: f.cierra,
    })),
    ...(sameAs.length ? { sameAs } : {}),
    hasMenu: {
      '@type': 'Menu',
      hasMenuSection: [
        { '@type': 'MenuSection', name: 'Platos', hasMenuItem: n.menu.platos.map((p) => item(p.nombre, p.precio, p.desc)) },
        { '@type': 'MenuSection', name: 'Bebidas', hasMenuItem: n.menu.bebidas.map((b) => item(b.nombre, b.precio)) },
      ],
    },
  };
}
