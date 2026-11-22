/* ==========================================================
   TRAKAS MEXICAN FOOD — DATOS ÚNICOS DEL NEGOCIO
   Cambia aquí los datos. Portada, /menu y datos para Google
   se actualizan solos. Valores entre [CORCHETES] = por completar.
   ========================================================== */

export interface Franja { dia: number; abre: string; cierra: string } // dia: 0=domingo … 6=sábado, horas 24h
export interface Plato {
  id: string; nombre: string; precio: number | null; desc: string;
  destacado?: boolean;
  foto?: string;   // ruta en /public (cuando lleguen las fotos reales)
  video?: string;  // nombre base del clip en /public/videos
}
export interface Proteina { nombre: string; desc: string }
export interface Bebida { nombre: string; precio: number | null }
export interface Negocio {
  nombre: string; nombresAlternos: string[]; eslogan: string;
  whatsapp: string; telefonoVisible: string;
  direccion: { calle: string; barrio: string; ciudad: string; departamento: string; codigoPostal: string; pais: string };
  geo: { lat: number; lng: number };
  googleMapsUrl: string; googleResenaUrl: string;
  horario: Franja[];
  redes: { instagram: string; facebook: string; tiktok: string };
  menu: { platos: Plato[]; proteinas: Proteina[]; bebidas: Bebida[] };
}

export const trakas: Negocio = {
  nombre: 'Trakas Mexican Food',
  nombresAlternos: ['Traaakas Taquería', 'Taquería Mexicana Trakass', 'Trakas Taquería'],
  eslogan: '¡Pica rico!',

  whatsapp: '573203172184',
  telefonoVisible: '320 317 2184',

  direccion: {
    calle: '[Calle 00 # 00-00]',
    barrio: '[Barrio]',
    ciudad: '[Ciudad]',
    departamento: '[Departamento]',
    codigoPostal: '[000000]',
    pais: 'CO',
  },
  geo: { lat: 4.711, lng: -74.0721 },
  googleMapsUrl: 'https://maps.google.com/?q=Trakas+Mexican+Food',
  googleResenaUrl: 'https://g.page/r/[TU-ID]/review',

  // [CONFIRMAR HORAS]
  horario: [
    { dia: 3, abre: '12:00', cierra: '22:00' }, // miércoles
    { dia: 4, abre: '12:00', cierra: '22:00' }, // jueves
    { dia: 5, abre: '12:00', cierra: '23:00' }, // viernes
    { dia: 6, abre: '12:00', cierra: '23:00' }, // sábado
    { dia: 0, abre: '12:00', cierra: '21:00' }, // domingo
  ],

  redes: {
    instagram: 'https://instagram.com/[usuario]',
    facebook: 'https://facebook.com/[pagina]',
    tiktok: 'https://tiktok.com/@[usuario]',
  },

  // Precios en pesos colombianos (null = "Pregunta")
  menu: {
    platos: [
      { id: 'birria', nombre: 'Tacos de Birria', precio: 25000, destacado: true,
        desc: 'Tortilla dorada en consomé, birria desmechada, cebolla y cilantro. Con consomé para mojar.' },
      { id: 'burrito', nombre: 'Burrito Mexicano', precio: 25000,
        desc: 'Tortilla de harina gigante rellena de tu proteína favorita, queso fundido y salsa de la casa.' },
      { id: 'chilaquiles', nombre: 'Chilaquiles', precio: 20000,
        desc: 'Totopos bañados en salsa roja, crema, queso y cilantro. El clásico mexicano.' },
      { id: 'ramen', nombre: 'Birria Ramen', precio: 20000, destacado: true,
        desc: 'Fideos en consomé de birria, carne desmechada y huevo. Fusión que enamora.' },
      { id: 'dorilocos', nombre: 'Dorilocos', precio: 20000,
        desc: 'Bolsa de Doritos cargada con proteína, queso, salsas y toppings locos.' },
      { id: 'volcanes', nombre: 'Volcanes x3', precio: 20000,
        desc: 'Tres tostadas con queso gratinado en erupción y tu proteína favorita.' },
      { id: 'gringas', nombre: 'Gringas x3', precio: 25000,
        desc: 'Tres tortillas de harina con queso derretido y carne. Crujientes por fuera, melosas por dentro.' },
    ],
    proteinas: [
      { nombre: 'Birria', desc: 'Res marinada en chiles y cocida lento' },
      { nombre: 'Pollo', desc: 'Desmechado y sazonado' },
      { nombre: 'Chorizo', desc: 'Picosito y dorado' },
      { nombre: 'Chanchullo', desc: 'La mezcla especial de la casa' },
    ],
    bebidas: [
      { nombre: 'Agua de Jamaica', precio: null },
      { nombre: 'Micheladas', precio: null },
      { nombre: 'Agua con Gas', precio: null },
      { nombre: 'Coca-Cola Personal', precio: null },
    ],
  },
};

/** Redes con enlace real (las que siguen con [marcador] no se muestran). */
export const redesActivas = (n: Negocio = trakas) =>
  Object.entries(n.redes).filter(([, url]) => url && !url.includes('[')) as [keyof Negocio['redes'], string][];
