# Guía para agregar los videos a la página

Copia tus videos a la carpeta `media-original/` con **estos nombres exactos** y avísame (o ejecuta `npm run media` y luego `npm run build`).
Cada video aparece solo en su lugar: no hay que tocar código. Lo que no exista todavía se sigue viendo como ahora.

| Archivo | Dónde aparece | Formato ideal | Qué grabar |
|---|---|---|---|
| `hero.mp4` | Fondo de la primera pantalla | **Horizontal** (16:9) | Comal humeando, birria desmechándose, consomé hirviendo. La acción a la **derecha** (a la izquierda va el texto, que oscurece esa zona). |
| `birria.mp4` | Tarjeta 01 · Tacos de Birria | **Vertical** (9:16) | Taco entrando al consomé, queso estirándose. |
| `ramen.mp4` | Tarjeta 02 · Birria Ramen | Vertical | Fideos levantándose con palillos, vapor. |
| `volcanes.mp4` | Tarjeta 03 · Volcanes | Vertical | Queso gratinado burbujeando. |
| `gringas.mp4` | Tarjeta 04 · Gringas | Vertical | Tortilla doblándose con queso derretido. |
| `chile.mp4` (opcional) | Sección "El Chile" | Vertical o cuadrado | La mascota en el local, stickers, empaques. |

## Consejos para que se vea profesional
- **Duración:** graba 10–20 s; la página usa los primeros 10 s y los repite en bucle. Que el final se parezca al inicio.
- **Celular fijo** (apoyado o con soporte), buena luz natural, sin zoom digital.
- El audio no se usa (la página los muestra en silencio).
- Calidad: 1080p o 4K, cualquiera sirve; el sistema los comprime solo (≈1 MB en celular).
- Si un video no empieza en el mejor momento, recórtalo antes en el celular.

## Qué hace el sistema automáticamente
- Quita el audio, recorta a 10 s, genera versión para celular (720p) y para computador (1080p) en dos formatos.
- Crea la imagen de portada de cada video (lo primero que se ve mientras carga).
- Los videos solo se descargan cuando su sección aparece en pantalla; con ahorro de datos no se descargan.
