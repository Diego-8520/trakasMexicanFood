/* ==========================================================
   TRAKAS MEXICAN FOOD — CONFIGURACIÓN ÚNICA
   Cambia aquí los datos del negocio. Todo el sitio (textos,
   horario, botones, mapa y datos para Google) se actualiza solo.
   Los valores entre [CORCHETES] son marcadores por completar.
   ========================================================== */
window.TRAKAS = {
  nombre: "Trakas Mexican Food",
  nombresAlternos: ["Traaakas Taquería", "Taquería Mexicana Trakass", "Trakas Taquería"],
  url: "https://[TU-DOMINIO].com",

  // Teléfono / WhatsApp (formato internacional, sin + ni espacios)
  whatsapp: "573203172184",
  telefonoVisible: "320 317 2184",

  // Dirección — debe ser IDÉNTICA a la de tu Perfil de Empresa de Google
  direccion: {
    calle: "[Calle 00 # 00-00]",
    barrio: "[Barrio]",
    ciudad: "[Ciudad]",
    departamento: "[Departamento]",
    codigoPostal: "[000000]",
    pais: "CO",
  },
  // Coordenadas del local (clic derecho sobre el pin en Google Maps → copiar)
  geo: { lat: 4.711, lng: -74.0721 },
  // Enlace "Compartir" de tu ficha en Google Maps
  googleMapsUrl: "https://maps.google.com/?q=Trakas+Mexican+Food",
  // Enlace directo para dejar reseña (Perfil de Empresa → "Pedir reseñas")
  googleResenaUrl: "https://g.page/r/[TU-ID]/review",

  // Horario: 0=domingo … 6=sábado. Horas en formato 24h. [CONFIRMAR HORAS]
  horario: [
    { dia: 3, abre: "12:00", cierra: "22:00" }, // miércoles
    { dia: 4, abre: "12:00", cierra: "22:00" }, // jueves
    { dia: 5, abre: "12:00", cierra: "23:00" }, // viernes
    { dia: 6, abre: "12:00", cierra: "23:00" }, // sábado
    { dia: 0, abre: "12:00", cierra: "21:00" }, // domingo
  ],

  // Redes sociales (deja "" las que no uses y no aparecerán)
  redes: {
    instagram: "https://instagram.com/[usuario]",
    facebook: "https://facebook.com/[pagina]",
    tiktok: "https://tiktok.com/@[usuario]",
  },

  // Menú — precios en pesos colombianos (null = "Pregunta")
  menu: {
    platos: [
      { id: "birria", nombre: "Tacos de Birria", precio: 25000, destacado: true,
        desc: "Tortilla dorada en consomé, birria desmechada, cebolla y cilantro. Con consomé para mojar." },
      { id: "burrito", nombre: "Burrito Mexicano", precio: 25000,
        desc: "Tortilla de harina gigante rellena de tu proteína favorita, queso fundido y salsa de la casa." },
      { id: "chilaquiles", nombre: "Chilaquiles", precio: 20000,
        desc: "Totopos bañados en salsa roja, crema, queso y cilantro. El clásico mexicano." },
      { id: "ramen", nombre: "Birria Ramen", precio: 20000, destacado: true,
        desc: "Fideos en consomé de birria, carne desmechada y huevo. Fusión que enamora." },
      { id: "dorilocos", nombre: "Dorilocos", precio: 20000,
        desc: "Bolsa de Doritos cargada con proteína, queso, salsas y toppings locos." },
      { id: "volcanes", nombre: "Volcanes x3", precio: 20000,
        desc: "Tres tostadas con queso gratinado en erupción y tu proteína favorita." },
      { id: "gringas", nombre: "Gringas x3", precio: 25000,
        desc: "Tres tortillas de harina con queso derretido y carne. Crujientes por fuera, melosas por dentro." },
    ],
    proteinas: [
      { nombre: "Birria", desc: "Res marinada en chiles y cocida lento" },
      { nombre: "Pollo", desc: "Desmechado y sazonado" },
      { nombre: "Chorizo", desc: "Picosito y dorado" },
      { nombre: "Chanchullo", desc: "La mezcla especial de la casa" },
    ],
    bebidas: [
      { nombre: "Agua de Jamaica", precio: null },
      { nombre: "Micheladas", precio: null },
      { nombre: "Agua con Gas", precio: null },
      { nombre: "Coca-Cola Personal", precio: null },
    ],
  },
};
