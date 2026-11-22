# Trakas Mexican Food — cómo trabajar con este cliente

Aprendizajes del historial del proyecto (ver `memoria/historial-proyecto.md` y el grafo en `memoria/graphify-out/`).

## Comunicación
- Responder en español, breve y directo. El cliente escribe mensajes cortos; la intención es clara aunque haya errores de tipeo.
- Mostrar resultados con imágenes (antes/después, hojas de contacto) antes que con explicaciones largas.
- Cuando dice "perfecto" o "me gusta" y añade una petición, la pieza anterior queda aprobada: no volver a tocarla.
- Trabajar por fases: si dice "enfoquémonos solo en X", no avanzar en otras piezas hasta que X esté aprobada.

## Diseño
- Fidelidad ante todo: nunca redibujar una marca existente; editar los píxeles del original con cambios mínimos.
- Las imágenes que aporta el cliente se usan tal cual. Solo se mejora la calidad técnica: recorte, fondo transparente, nitidez, resolución.
- Para personajes, pedir o usar referencias visuales pronto; generar personajes por código rinde peor que su ilustración.
- Revisar al 100 % antes de presentar: el cliente detecta defectos finos (letras, bordes, halos de recorte, restos).
- Todo diseño pasa por el equipo de revisión (director de arte, ilustrador, tipógrafo, marca/web). Se aprueba con 8/10 o más por parte.
- No sobrescribir trabajo aprobado: guardar versiones (`marca/`, p. ej. `marca/logo/*-master*.png`, `marca/mascota/v1-con-huecos/`).

## Estado de las piezas
- **Sitio:** Astro 5 en la raíz (plan: `docs/superpowers/plans/2026-11-22-sitio-final-astro.md`). Portada concepto B "Cine de comal" + cinta roja: **aprobada** ("está perfecta"). `/menu` y tarjeta QR aprobadas.
- **Logo vigente:** `marca/logo/logo-trakas-master-v2.png` (copias del sitio en `src/assets/brand/logo/`).
- **Mascota oficial:** `marca/mascota/` (huecos blancos ya transparentes; recortes anteriores en `marca/mascota/v1-con-huecos/`; originales del cliente en `marca/originales-cliente/`). Copias del sitio en `src/assets/brand/mascota/`.
- **Fuente de titulares:** `marca/fuente/` · servida desde `public/fonts/TrakasBrush.woff2` (mínimo 28 px).
- **Videos y fotos:** el cliente los está produciendo según `docs/GUIA-VIDEOS.md`; se integran con `npm run media`.
