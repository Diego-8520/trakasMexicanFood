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
  conProteina?: boolean; // el cliente elige proteína (Birria, Pollo, Chorizo, Chanchullo)
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
  geo: { lat: 4.711, lng: -74.0721 }, // [CONFIRMAR] se publica junto con la dirección real
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
        desc: 'Tortilla artesanal en consomé, birria desmechada, cebolla y cilantro. Consomé para mojar.' },
      { id: 'burrito', nombre: 'Burrito Mexicano', precio: 25000, conProteina: true,
        desc: 'Tortilla artesanal de harina, grande y bien cargada: tu proteína, queso fundido y salsa de la casa.' },
      { id: 'chilaquiles', nombre: 'Chilaquiles', precio: 20000,
        desc: 'Totopos crujientes bañados en salsa roja, con crema, queso y cilantro. El desayuno de México, a cualquier hora.' },
      { id: 'ramen', nombre: 'Ramen', precio: 20000, destacado: true,
        desc: 'Fideos en el consomé de la birria, con carne desmechada y huevo. Para los días de cuchara.' },
      { id: 'dorilocos', nombre: 'Dorilocos', precio: 20000, conProteina: true,
        desc: 'La bolsa de Doritos abierta y cargada: tu proteína, queso, salsas y toppings. Se come con cuchara.' },
      { id: 'volcanes', nombre: 'Volcanes x3', precio: 20000, conProteina: true,
        desc: 'Tres tostadas con queso gratinado que se desborda y tu proteína encima.' },
      { id: 'gringas', nombre: 'Gringas x3', precio: 25000,
        desc: 'Tres tortillas artesanales de harina con queso derretido y carne. Crujientes por fuera, fundidas por dentro.' },
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

/* ==========================================================
   MENSAJE DE MARCA — una sola idea en todo el sitio:
   birria en consomé + tortillas artesanales, al comal cuando pides.
   Portada, /menu, cinta, WhatsApp y datos para Google leen de aquí.
   ========================================================== */
export const marca = {
  promesa: 'Birria en consomé y tortillas artesanales, al comal cuando pides.',
  pilares: [
    { titulo: 'Tortillas artesanales', texto: 'Nada de tortilla de paquete. Usamos tortillas artesanales, con el sabor y la textura de la masa de verdad, y las pasamos por el comal cuando pides.' },
    { titulo: 'Cocción lenta', texto: 'La birria se marina en chiles y se cocina con paciencia, hasta que la carne se deshace sola y deja un consomé para mojar.' },
    { titulo: 'México y Colombia', texto: 'Recetas mexicanas con el corazón de casa. Por eso las dos banderas viven en nuestro logo.' },
  ],
  cinta: ['¡Pica rico!', 'Birria en consomé', 'Tortillas artesanales', 'Birria ramen', 'Domicilios por WhatsApp'],
  whatsapp: {
    pedido: '¡Hola Trakas! Quiero hacer un pedido 🌮',
    domicilio: '¡Hola Trakas! Quiero un domicilio 🛵',
    direccion: '¡Hola Trakas! ¿Me pasan la dirección del local?',
  },
};

/** Redes con enlace real (las que siguen con [marcador] no se muestran). */
export const redesActivas = (n: Negocio = trakas) =>
  Object.entries(n.redes).filter(([, url]) => url && !url.includes('[')) as [keyof Negocio['redes'], string][];
