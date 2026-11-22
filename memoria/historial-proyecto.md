# Historial del proyecto Trakas Mexican Food

Registro de la colaboración entre el dueño del restaurante (cliente) y Claude, para aprender de lo que funcionó y lo que no.

## 1. Encargo inicial
- El cliente pidió una página de presentación y menú para su restaurante de comida mexicana, optimizada para Google Maps y conectada con sus redes sociales.
- Pidió trabajar "como un equipo de expertos": un equipo propone, un segundo equipo evalúa y mejora, y después se presenta.
- Las imágenes estaban en su PC Windows; la sesión corre en la nube y no podía verlas. Primero llegaron como vista previa en el chat, sin archivo. Archivos reales solo llegaron más tarde (logo 1.webp, mascota 3.jpg, poses 4–8).
- Decisiones del cliente: nombre oficial "Trakas Mexican Food", precios en miles de pesos colombianos (COP), datos de dirección, horario y redes como marcadores, entrega con propuesta + sitio listo.

## 2. Sitio web v1
- Sitio estático (HTML, CSS, JS) con menú en pestañas, WhatsApp +57 320 317 2184, horario con estado "abierto/cerrado", datos estructurados Schema.org Restaurant y Menu, sitemap y robots.
- La guía de marca se publicó como Artifact de claude.ai.
- Paleta tomada del logo: rojo chile, naranja fuego, amarillo maíz, verde nopal, ocre sombrero, negro comal, crema tortilla.

## 3. Logo: rechazos y aciertos
- Primer intento: redibujar el logo en SVG desde cero porque no había archivo. **El cliente lo rechazó: "demasiados cambios en el estilo".** Lección: no redibujar una marca existente; editar los píxeles del original.
- Con el archivo original: se editó píxel a píxel. TRAAAKAS pasó a TRAKAS y TAQUERIA a MEXICAN FOOD, se quitó el fondo y se completó el aro verde. **Respuesta del cliente: "excelente trabajo, pero quiero que pulas mejor el logo".**
- El cliente detalló defectos concretos: R cortada, forma extraña entre A y K, banderas mal hechas e incompletas, sombrero cortado, fuego de estilo distinto al chile. Lección: el cliente mira detalles finos; hay que revisar al 100 % antes de presentar.
- El cliente pidió explícitamente: instalar las skills necesarias, usar graphify y que **todo diseño sea creado y evaluado por un equipo de diseño que revise cada detalle**.
- Equipo de revisión (subagentes): director de arte, ilustrador, tipógrafo y especialista en marca/web. Puntuación 1–10 por parte; solo se aprueba con 8 o más.
- El logo v5 se aprobó tras 3 rondas.

## 4. Tipografía
- Ninguna fuente libre igualaba la letra del logo. Se creó "Trakas Brush" (letras T, R, A, K, S del logo + glifos nuevos con el mismo rasgado, alternativas calt y kerning).
- Se aprobó en 2 rondas. Uso mínimo: 28 px.

## 5. Mascota: la parte más iterada
- 17 variantes generadas por código sobre el chile del logo (expresiones, poses, stickers, favicon). Necesitaron 3 rondas del equipo (parches de retoque, lente cortada, brazos planos).
- **Cliente: "el cuerpo se ve incompleto"** (punta recortada, sin piernas). Pidió concentrarse solo en el chile.
- Se probó punta larga + piernas con botas vaqueras + brazos en jarra.
- El cliente mandó un chile verde de referencia: quiere brazos y piernas tipo tubo en rojo, guantes blancos y zapatillas.
- El cliente mandó un collage "mal hecho" para mostrar la idea: cuerpo rechoncho y curvo, una mano en la cadera y la otra bajo el fuego, zapatillas verdes.
- **Finalmente el cliente entregó su propia ilustración final de la mascota** ("Este es el logo") y después 5 imágenes con poses (taco, moto, fuego, emblema circular, presentando).
- Lección: para personajes, el cliente comunica mejor con imágenes de referencia que con palabras. Conviene pedir referencias visuales pronto en vez de iterar a ciegas con código.

## 6. Logo final con la mascota oficial
- El cliente pidió recrear el logo "tal cual como era originalmente", con la mascota nueva y sin brazos ni piernas.
- Se reutilizó todo el emblema aprobado y se cambió solo el chile (espejado para que el fuego vaya a la derecha, anclado por las gafas).
- Se aprobó en 2 rondas. **Cliente: "ha quedado perfecto".**

## 7. Estilo de comunicación del cliente
- Escribe en español, con mensajes cortos y directos, a veces con errores de tipeo; la intención siempre es clara.
- Expresa aprobación breve ("Perfecto", "me gusta", "excelente trabajo") y después pide la siguiente mejora en el mismo mensaje.
- Rechaza con frases cortas y concretas: "demasiados cambios en el estilo", "el cuerpo se ve incompleto".
- Señala defectos visuales muy específicos (una letra, un borde, una zona del sombrero).
- Prefiere ver resultados en imágenes antes que leer explicaciones largas.
- Quiere un proceso profesional: equipo de expertos, evaluación por pares, skills y herramientas.
- Prioriza la fidelidad a lo que ya existe: cambios mínimos y estilo intacto.
- Trabaja por fases: "enfoquémonos solo en el chile; luego trabajaremos en lo demás".
- Aporta sus propias imágenes generadas cuando la iteración no converge, y espera que se usen tal cual, mejorando solo la calidad técnica.

## 8. Lecciones operativas
- Las imágenes adjuntadas en el chat de la app no siempre llegan como archivo a la sesión en la nube; a veces sí (carpeta images/).
- El trabajo por código (OpenCV/PIL) sirve para editar y componer, pero rinde peor que una ilustración real para crear personajes nuevos.
- La revisión del equipo detecta defectos que se escapan en una sola mirada (halos de recorte, costuras, restos de brazos).
- No sobrescribir trabajo aprobado: guardar versiones (logo-trakas-master.png → master-v2).
- Presentar siempre comparaciones antes y después y hojas de contacto.
- Un límite de uso cortó a los subagentes a mitad de una ronda; se reanudaron con SendMessage.
