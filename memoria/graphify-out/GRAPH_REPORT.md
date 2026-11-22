# Graph Report - memoria  (2026-11-22)

## Corpus Check
- Corpus is ~944 words - fits in a single context window. You may not need a graph.

## Summary
- 55 nodes · 79 edges · 6 communities
- Extraction: 65% EXTRACTED · 35% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.81)
- Token cost: 0 input · 85,975 output

## Community Hubs (Navigation)
- Proceso y equipo de revisión
- Entregables técnicos y sitio
- Estilo de feedback del cliente
- Fidelidad al logo original
- Referencias visuales y mascota
- Actores del proyecto

## God Nodes (most connected - your core abstractions)
1. `Equipo de revisión (subagentes)` - 12 edges
2. `Estilo de comunicación del cliente` - 10 edges
3. `Trakas Mexican Food (proyecto)` - 9 edges
4. `Mascota oficial (ilustración final del cliente)` - 7 edges
5. `Sitio web v1` - 5 edges
6. `Logo original (logo 1.webp)` - 5 edges
7. `Rechazo: 'el cuerpo se ve incompleto'` - 5 edges
8. `Logo final con la mascota oficial` - 5 edges
9. `Cliente (dueño del restaurante)` - 4 edges
10. `Rechazo: 'demasiados cambios en el estilo'` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Equipo de revisión (subagentes)` --conceptually_related_to--> `Fuente 'Trakas Brush'`  [INFERRED]
  historial-proyecto.md → historial-proyecto.md  _Bridges community 0 → community 1_
- `Rechazo: 'el cuerpo se ve incompleto'` --rationale_for--> `Lección: pedir referencias visuales pronto para personajes`  [INFERRED]
  historial-proyecto.md → historial-proyecto.md  _Bridges community 2 → community 4_
- `Historial del proyecto Trakas Mexican Food` --references--> `Estilo de comunicación del cliente`  [EXTRACTED]
  historial-proyecto.md → historial-proyecto.md  _Bridges community 5 → community 2_
- `Trakas Mexican Food (proyecto)` --references--> `Logo final con la mascota oficial`  [EXTRACTED]
  historial-proyecto.md → historial-proyecto.md  _Bridges community 5 → community 3_
- `Trakas Mexican Food (proyecto)` --references--> `Mascota oficial (ilustración final del cliente)`  [EXTRACTED]
  historial-proyecto.md → historial-proyecto.md  _Bridges community 5 → community 4_

## Hyperedges (group relationships)
- **Ciclo de rechazos y aciertos del logo** — historial_proyecto_logo_svg_redraw, historial_proyecto_fb_too_many_changes, historial_proyecto_logo_pixel_edit, historial_proyecto_fb_polish_logo, historial_proyecto_fb_specific_defects, historial_proyecto_logo_v5 [EXTRACTED 1.00]
- **Equipo de revisión de diseño** — historial_proyecto_review_team, historial_proyecto_role_art_director, historial_proyecto_role_illustrator, historial_proyecto_role_typographer, historial_proyecto_role_brand_web, historial_proyecto_approval_threshold [EXTRACTED 1.00]
- **Iteración de la mascota hasta la oficial** — historial_proyecto_mascot_variants, historial_proyecto_fb_body_incomplete, historial_proyecto_mascot_long_tip, historial_proyecto_ref_green_chile, historial_proyecto_ref_collage, historial_proyecto_official_mascot [INFERRED 0.85]

## Communities (6 total, 0 thin omitted)

### Community 0 - "Proceso y equipo de revisión"
Cohesion: 0.18
Nodes (6): graphify, Equipo de revisión (subagentes), Director de arte, Especialista en marca/web, Ilustrador, Tipógrafo

### Community 1 - "Entregables técnicos y sitio"
Cohesion: 0.20
Nodes (8): Guía de marca (Artifact claude.ai), Paleta del logo (rojo chile, naranja fuego, amarillo maíz, verde nopal, ocre sombrero, negro comal, crema tortilla), Mascota: 17 variantes generadas por código, Logo original (logo 1.webp), Datos estructurados Schema.org Restaurant y Menu, Fuente 'Trakas Brush', Sitio web v1, WhatsApp +57 320 317 2184

### Community 2 - "Estilo de feedback del cliente"
Cohesion: 0.24
Nodes (4): Rechazo: 'el cuerpo se ve incompleto', Feedback: 'excelente trabajo, pero quiero que pulas mejor el logo', Feedback: defectos concretos (R cortada, forma A-K, banderas, sombrero cortado, fuego distinto), Mascota con punta larga, botas vaqueras y brazos en jarra

### Community 3 - "Fidelidad al logo original"
Cohesion: 0.28
Nodes (6): Aprobación: 'ha quedado perfecto', Rechazo: 'demasiados cambios en el estilo', Logo final con la mascota oficial, Logo editado píxel a píxel (TRAKAS / MEXICAN FOOD), Logo redibujado en SVG desde cero (primer intento), Logo v5 (aprobado tras 3 rondas)

### Community 4 - "Referencias visuales y mascota"
Cohesion: 0.29
Nodes (4): 5 poses de la mascota (taco, moto, fuego, emblema circular, presentando), Mascota oficial (ilustración final del cliente), Collage 'mal hecho' del cliente (cuerpo rechoncho, mano en cadera, zapatillas verdes), Referencia del cliente: chile verde (brazos/piernas tubo, guantes blancos, zapatillas)

### Community 5 - "Actores del proyecto"
Cohesion: 0.60
Nodes (4): Claude, Cliente (dueño del restaurante), Historial del proyecto Trakas Mexican Food, Trakas Mexican Food (proyecto)

## Knowledge Gaps
- **13 isolated node(s):** `Claude`, `WhatsApp +57 320 317 2184`, `Datos estructurados Schema.org Restaurant y Menu`, `Guía de marca (Artifact claude.ai)`, `Logo redibujado en SVG desde cero (primer intento)` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 20 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Equipo de revisión (subagentes)` connect `Proceso y equipo de revisión` to `Entregables técnicos y sitio`, `Fidelidad al logo original`?**
  _High betweenness centrality (0.320) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Equipo de revisión (subagentes)` (e.g. with `Proceso 'equipo de expertos' (propone / evalúa / presenta)` and `Lección: la revisión del equipo detecta defectos ocultos`) actually correct?**
  _`Equipo de revisión (subagentes)` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Claude`, `WhatsApp +57 320 317 2184`, `Datos estructurados Schema.org Restaurant y Menu` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Why does `Trakas Mexican Food (proyecto)` connect `Actores del proyecto` to `Entregables técnicos y sitio`, `Fidelidad al logo original`, `Referencias visuales y mascota`?**
  _High betweenness centrality (0.266) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Mascota oficial (ilustración final del cliente)` (e.g. with `Aporta sus propias imágenes y espera que se usen tal cual` and `Collage 'mal hecho' del cliente (cuerpo rechoncho, mano en cadera, zapatillas verdes)`) actually correct?**
  _`Mascota oficial (ilustración final del cliente)` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Why does `Estilo de comunicación del cliente` connect `Estilo de feedback del cliente` to `Proceso y equipo de revisión`, `Fidelidad al logo original`, `Referencias visuales y mascota`, `Actores del proyecto`?**
  _High betweenness centrality (0.233) - this node is a cross-community bridge._