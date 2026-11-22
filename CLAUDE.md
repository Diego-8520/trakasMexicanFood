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
- No sobrescribir trabajo aprobado: guardar versiones (`assets/source/*-master*.png`).

## Estado de las piezas
- **Sitio:** Astro 5 en la raíz (plan: `docs/superpowers/plans/2026-11-22-sitio-final-astro.md`). Prototipo anterior en `prototipo/` (no se publica).
- **Logo vigente:** `prototipo/assets/logo-nuevo/` (master en `prototipo/assets/source/logo-trakas-master-v2.png`), hecho con la mascota oficial. Copia exacta para el sitio en `public/brand/logo/`.
- **Mascota oficial:** `prototipo/assets/mascota-oficial/` (originales del cliente en `prototipo/assets/source/`). Copia exacta en `public/brand/mascota/`.
- **Fuente de titulares:** `public/fonts/TrakasBrush.woff2` (mínimo 28 px).
