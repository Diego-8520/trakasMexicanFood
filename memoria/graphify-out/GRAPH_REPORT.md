# Graph Report - memoria  (2026-11-22)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 70 nodes · 100 edges · 7 communities
- Extraction: 70% EXTRACTED · 30% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8cc95d87`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Equipo de revisión (subagentes)
- Logo original (logo 1.webp)
- Estilo de comunicación del cliente
- Logo final con la mascota oficial
- Mascota oficial (ilustración final del cliente)
- Trakas Mexican Food (proyecto)
- Sitio final en Astro 5

## God Nodes (most connected - your core abstractions)
1. `Equipo de revisión (subagentes)` - 12 edges
2. `Estilo de comunicación del cliente` - 11 edges
3. `Trakas Mexican Food (proyecto)` - 10 edges
4. `Mascota oficial (ilustración final del cliente)` - 7 edges
5. `Cliente (dueño del restaurante)` - 7 edges
6. `Sitio final en Astro 5` - 7 edges
7. `Sitio web v1` - 6 edges
8. `Logo original (logo 1.webp)` - 5 edges
9. `Rechazo: 'el cuerpo se ve incompleto'` - 5 edges
10. `Logo final con la mascota oficial` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Equipo de revisión (subagentes)` --conceptually_related_to--> `Fuente 'Trakas Brush'`  [INFERRED]
  historial-proyecto.md → historial-proyecto.md  _Bridges community 0 → community 1_
- `Rechazo: 'el cuerpo se ve incompleto'` --rationale_for--> `Lección: pedir referencias visuales pronto para personajes`  [INFERRED]
  historial-proyecto.md → historial-proyecto.md  _Bridges community 2 → community 4_
- `Armonía de marca y copys (2026-11-22)` --conceptually_related_to--> `Estilo de comunicación del cliente`  [INFERRED]
  historial-proyecto.md → historial-proyecto.md  _Bridges community 2 → community 6_
- `Equipo de revisión (subagentes)` --conceptually_related_to--> `Logo v5 (aprobado tras 3 rondas)`  [EXTRACTED]
  historial-proyecto.md → historial-proyecto.md  _Bridges community 0 → community 3_
- `Estilo de comunicación del cliente` --references--> `Quiere un proceso profesional (expertos, evaluación por pares, skills)`  [EXTRACTED]
  historial-proyecto.md → historial-proyecto.md  _Bridges community 0 → community 2_

## Hyperedges (group relationships)
- **Ciclo de rechazos y aciertos del logo** — historial_proyecto_logo_svg_redraw, historial_proyecto_fb_too_many_changes, historial_proyecto_logo_pixel_edit, historial_proyecto_fb_polish_logo, historial_proyecto_fb_specific_defects, historial_proyecto_logo_v5 [EXTRACTED 1.00]
- **Equipo de revisión de diseño** — historial_proyecto_review_team, historial_proyecto_role_art_director, historial_proyecto_role_illustrator, historial_proyecto_role_typographer, historial_proyecto_role_brand_web, historial_proyecto_approval_threshold [EXTRACTED 1.00]
- **Iteración de la mascota hasta la oficial** — historial_proyecto_mascot_variants, historial_proyecto_fb_body_incomplete, historial_proyecto_mascot_long_tip, historial_proyecto_ref_green_chile, historial_proyecto_ref_collage, historial_proyecto_official_mascot [INFERRED 0.85]

## Communities (7 total, 0 thin omitted)

### Community 0 - "Equipo de revisión (subagentes)"
Cohesion: 0.18
Nodes (13): Umbral de aprobación: puntuación ≥ 8/10 por parte, Quiere un proceso profesional (expertos, evaluación por pares, skills), Proceso 'equipo de expertos' (propone / evalúa / presenta), graphify, Lección: el cliente mira detalles finos; revisar al 100 % antes de presentar, Lección: la revisión del equipo detecta defectos ocultos, Lección: subagentes cortados por límite de uso se reanudan con SendMessage, Pedido: todo diseño creado y evaluado por un equipo de diseño (+5 more)

### Community 1 - "Logo original (logo 1.webp)"
Cohesion: 0.20
Nodes (10): Guía de marca (Artifact claude.ai), Paleta del logo (rojo chile, naranja fuego, amarillo maíz, verde nopal, ocre sombrero, negro comal, crema tortilla), Lección: imágenes del chat no siempre llegan como archivo a la nube, Lección: código (OpenCV/PIL) sirve para editar, no para crear personajes, Mascota: 17 variantes generadas por código, Logo original (logo 1.webp), Datos estructurados Schema.org Restaurant y Menu, Fuente 'Trakas Brush' (+2 more)

### Community 2 - "Estilo de comunicación del cliente"
Cohesion: 0.24
Nodes (10): Aprobación breve seguida de la siguiente mejora, Trabaja por fases, Rechazos con frases cortas y concretas, Mensajes en español, cortos y directos, Señala defectos visuales muy específicos, Estilo de comunicación del cliente, Rechazo: 'el cuerpo se ve incompleto', Feedback: 'excelente trabajo, pero quiero que pulas mejor el logo' (+2 more)

### Community 3 - "Logo final con la mascota oficial"
Cohesion: 0.28
Nodes (9): Prioriza fidelidad: cambios mínimos y estilo intacto, Aprobación: 'ha quedado perfecto', Rechazo: 'demasiados cambios en el estilo', Logo final con la mascota oficial, Lección: no redibujar una marca existente; editar píxeles del original, Lección: no sobrescribir trabajo aprobado; guardar versiones, Logo editado píxel a píxel (TRAKAS / MEXICAN FOOD), Logo redibujado en SVG desde cero (primer intento) (+1 more)

### Community 4 - "Mascota oficial (ilustración final del cliente)"
Cohesion: 0.29
Nodes (8): Aporta sus propias imágenes y espera que se usen tal cual, Prefiere ver resultados en imágenes, Lección: presentar comparaciones antes/después y hojas de contacto, Lección: pedir referencias visuales pronto para personajes, 5 poses de la mascota (taco, moto, fuego, emblema circular, presentando), Mascota oficial (ilustración final del cliente), Collage 'mal hecho' del cliente (cuerpo rechoncho, mano en cadera, zapatillas verdes), Referencia del cliente: chile verde (brazos/piernas tubo, guantes blancos, zapatillas)

### Community 5 - "Trakas Mexican Food (proyecto)"
Cohesion: 0.29
Nodes (10): Carrusel horizontal de la carta por capítulos, Claude, Cliente (dueño del restaurante), Decisiones iniciales del cliente, Portada concepto B "Cine de comal" + cinta roja, Historial del proyecto Trakas Mexican Food, Globo de diálogo pegado al Chile en el hero, Corrección: hueco blanco en el brazo del Chile (+2 more)

### Community 6 - "Sitio final en Astro 5"
Cohesion: 0.20
Nodes (10): Armonía de marca y copys (2026-11-22), Sitio final en Astro 5, Bloque marca en src/data/trakas.ts, Guía de videos (guion visual por escena), Lección: e2e del precio sobre el botón fijo en /menu, Mejoras UX: WhatsApp fijo, pedir dirección, proteínas, Menú QR /menu y tarjeta A6, Pendientes: dirección, reseñas, redes, gringas (+2 more)

## Knowledge Gaps
- **19 isolated node(s):** `graphify`, `Director de arte`, `Especialista en marca/web`, `Ilustrador`, `Tipógrafo` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 26 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Trakas Mexican Food (proyecto)` connect `Trakas Mexican Food (proyecto)` to `Logo original (logo 1.webp)`, `Logo final con la mascota oficial`, `Mascota oficial (ilustración final del cliente)`, `Sitio final en Astro 5`?**
  _High betweenness centrality (0.308) - this node is a cross-community bridge._
- **Why does `Equipo de revisión (subagentes)` connect `Equipo de revisión (subagentes)` to `Logo original (logo 1.webp)`, `Logo final con la mascota oficial`?**
  _High betweenness centrality (0.257) - this node is a cross-community bridge._
- **Why does `Estilo de comunicación del cliente` connect `Estilo de comunicación del cliente` to `Equipo de revisión (subagentes)`, `Logo final con la mascota oficial`, `Mascota oficial (ilustración final del cliente)`, `Trakas Mexican Food (proyecto)`, `Sitio final en Astro 5`?**
  _High betweenness centrality (0.246) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Equipo de revisión (subagentes)` (e.g. with `Proceso 'equipo de expertos' (propone / evalúa / presenta)` and `Lección: la revisión del equipo detecta defectos ocultos`) actually correct?**
  _`Equipo de revisión (subagentes)` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Mascota oficial (ilustración final del cliente)` (e.g. with `Aporta sus propias imágenes y espera que se usen tal cual` and `Collage 'mal hecho' del cliente (cuerpo rechoncho, mano en cadera, zapatillas verdes)`) actually correct?**
  _`Mascota oficial (ilustración final del cliente)` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `graphify`, `Director de arte`, `Especialista en marca/web` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._