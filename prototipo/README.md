# Trakas Mexican Food — sitio web

Sitio estático (HTML + CSS + JS, sin dependencias). Para verlo con la fuente propia, ábrelo desde un servidor (por ejemplo `python3 -m http.server` en esta carpeta); con doble clic también funciona, pero algunos navegadores bloquean la fuente en archivos locales.

## 1. Lo que ya incluye
- `assets/logo.png`, `logo-1024.webp`: logo TRAKAS Mexican Food (transparente). `logo-sticker*`: versión con borde crema para fondos oscuros.
- `assets/source/`: logo original sin tocar y el máster corregido (2000 px).
- `assets/mascota/`: 17 piezas de la mascota (PNG y WebP de 1024 px; `web/` con WebP de 480 px para el sitio).
- `fonts/TrakasBrush.woff2` / `.ttf`: tipografía propia para titulares (mínimo 28 px). Licencia OFL (base Passion One).
- Íconos: `favicon-32/48.png`, `icon-192/512.png`, `apple-touch-icon.png`; imagen para compartir: `og-image.jpg`.

Falta solo copiar la imagen del menú impreso como `assets/menu.jpg`.

## 2. Completa tus datos (un solo archivo)
Edita `data/config.js` y reemplaza todo lo que esté entre `[CORCHETES]`:
dirección, ciudad, coordenadas, horas de apertura, redes sociales, enlace de Google Maps y de reseñas.
El menú y los precios también se cambian ahí. Todo el sitio y los datos para Google se actualizan solos.

En `index.html`, `robots.txt` y `sitemap.xml` cambia `[Ciudad]` y `[TU-DOMINIO]`.

## 3. Publicar gratis
- **Vercel / Netlify:** arrastra la carpeta completa en app.netlify.com/drop o crea un proyecto en Vercel. Luego conecta tu dominio.

## 4. Google Maps (Perfil de Empresa)
1. Entra a business.google.com y crea/reclama "Trakas Mexican Food".
2. Categoría principal: *Restaurante mexicano*; secundarias: *Taquería*, *Servicio de entrega de comida*.
3. Usa **exactamente** el mismo nombre, dirección y teléfono que en `config.js` (consistencia NAP).
4. Horario: miércoles a domingo. Agrega la URL del sitio y el enlace de WhatsApp como "Pedidos".
5. Sube 10+ fotos reales (platos, fachada, interior) y el menú con precios.
6. Copia el enlace "Pedir reseñas" en `googleResenaUrl` y pídelas a cada cliente feliz.
7. Usa el mismo nombre y enlace al sitio en Instagram, Facebook y TikTok.
8. Valida los datos estructurados en search.google.com/test/rich-results.

## Guía de marca
Abre `brand/guia-de-marca.html`.
