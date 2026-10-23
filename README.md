# Centro Educativo de las Américas (CELA) — Concepto visual premium

Propuesta de página institucional para el **Centro Educativo de las Américas**, Mariano Roque Alonso (Paraguay). Creada por **NovaTec Engineering** como demostración independiente. **No es el sitio oficial ni fue aprobada por la institución.**

## Contenido de la demo

- Identidad visual **luminosa** para público escolar: azul claro, blanco cálido, menta, amarillo y un emblema ilustrativo original.
- Intro cinematográfica corta y removida del DOM, con consideración de `prefers-reduced-motion`.
- Diseño responsive con fotografías ilustrativas, copy personalizado, niveles educativos interactivos por pestañas accesibles, tarjetas de vida escolar y valores.
- Formulario de consulta que **solo prepara un mensaje en WhatsApp** a `+595 986 251205` en el navegador. No hay servidor ni captura de datos.
- Contactos telefónicos, enlace a mapas, preguntas frecuentes.
- Pruebas automáticas con Chromium en escritorio/móvil y capturas accesibles desde GitHub Actions.

## Investigación documentada

Fuentes públicas consultadas el 23 de octubre de 2026:

1. [Centro Educativo de las Americas S.R.L — publicaciones y descripción institucional](https://www.schoolandcollegelistings.com/PY/Mariano-Roque-Alonso/173917232638768/Centro-Educativo-de-las-Americas-S.R.L). Esta página reproduce reseña del colegio: **fundado 14 de febrero de 2002**, resolución Nº 1626 (26 de septiembre de 2002), misión y visión institucionales. Incluye publicaciones sobre **Noche de Talentos (20 abril de 2026)**, **Intercurso (mayo de 2026)** y **OMAPA categoría infantil (octubre de 2025)**.
2. [Guía de establecimientos — institución Nº 6246](https://guia-central.educacionenparaguay.com/jardin/6246-CENTRO-EDUCATIVO-DE-LAS-AMERICAS-concordia-mariano-roque-alonso-central-i9238.htm). Institución privada; **Jardín, Preescolar, Escolar Básica primer/segundo/tercer ciclo y Educación Media**. Dirección: Ruta Transchaco km 15, cerca de Humaitá, Mariano Roque Alonso; teléfono (021) 751 604.
3. [CELA — Guía de Paraguay](https://guiaparaguay.com.py/poi/88476-cela-%28centro-educativo-de-las-am%C3%A9ricas%29.html). Confirma número de celular **0986 251205** y ubicación.
4. [Guía comercial local](https://www.guia.com.py/cela-centro-educativo-de-las-americas/): contacto +595 986 251205.

**Importante**: Que el número sea móvil no garantiza que tenga una cuenta de WhatsApp habilitada; verificar antes de usar el enlace en una web oficial. Tampoco se han validado **vacantes, precios, horarios, requisitos actuales o niveles específicos para 2027**. Se omiten de la demo.

Las fotografías en URLs de `images.unsplash.com` son **referenciales**; no representan a alumnos, docentes, actividades, instalaciones o trabajos de CELA. El emblema `assets/cela-mark.svg` es **conceptual**, no una reproducción del logo institucional. Reemplazar por material propio con permisos antes de un lanzamiento oficial.

## Estructura técnica

- `index.html`: contenido semántico y metadatos.
- `styles.css`: diseño, animaciones, responsive y accesibilidad visual.
- `app.js`: menú, pestañas, animación inicial, efectos de aparición y formulario WhatsApp.
- `assets/cela-mark.svg`: ilustración vectorial conceptual.
- `tests/visual-qa.mjs`: pruebas Playwright.
- `.github/workflows/cela-qa.yml`: CI con capturas de pantalla de escritorio y celular.

No requiere servidor ni base de datos. GitHub Pages publica el `index.html` de `main`. Para convertir en sitio institucional, confirmar contenido con la dirección, incorporar fotografías autorizadas y logo, reemplazar datos, agregar política de privacidad según corresponda y retirar `noindex,nofollow` después de la autorización.
