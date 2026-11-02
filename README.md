# MCA Constructora & Servicios Smart — propuesta digital empresarial
**NovaTec Engineering · Concepto para evaluación comercial · 2 de noviembre de 2026**

Este repositorio contiene dos experiencias institucionales coherentes, desarrolladas como prototipo navegable y **no como sitio oficial**.

## Direcciones
- `index.html`: MCA — desarrollo industrial, parques industriales e infraestructura.
- `parques-industriales.html`: vertical de parques y simulador interactivo de plan maestro. **No representa lotes reales, disponibilidad ni superficies verificadas.**
- `proyectos.html`: catálogo y fichas filtrables con antecedentes publicados.
- `servicios-smart.html`: presentación comercial independiente de Servicios Smart, complementaria a MCA.
- `contacto.html`: formulario comercial diferenciado para inversiones, proyectos industriales, ingeniería, montajes y mantenimiento.

## Funcionalidad de demostración
- Animación de entrada, navegación adaptativa y respetuosa con reducción de movimiento.
- Catálogo de proyectos editable mediante `assets/projects.json`.
- Masterplan ilustrativo interactivo con 6 sectores ficticios y selección accesible por teclado.
- Formularios comerciales sin backend: los botones preparan mensajes por WhatsApp (`+595981876316`) y correo (`camaidana@mcapy.solutions`) en el equipo del usuario. **No se envían automáticamente ni se guardan datos.**
- Fichas de proyectos modal, filtros y captura de pantalla automatizada.
- Meta `noindex,nofollow` para evitar presentar la demo como un sitio institucional definitivo.

## Fuentes verificadas
- [Web actual MCA — inicio](https://www.mcaconstructora.com/): mención a construcción industrial, parques industriales, media y baja tensión, tableros, y proyectos en localidades de Paraguay.
- [MCA — servicios](https://www.mcaconstructora.com/services): **Planta industrial (1.620 m²)** y **Centro logístico MRA (1.600 m²)**. Se los muestra como antecedentes publicados; no se inventan estado ni cliente final.
- [MCA — Parque Industrial y Logístico Paraná](https://www.mcaconstructora.com/parqueindustrialparana): **30.000 m²**, infraestructura industrial y servicios divulgados en el sitio de origen. Disponibilidad y etapa requieren validación.
- [MCA — Galpones Luque](https://www.mcaconstructora.com/galponesluque): **3.500 m²** según página actual.
- [MCA — Contacto](https://www.mcaconstructora.com/contact): **+595981876316**, correo **camaidana@mcapy.solutions**, dirección **San Francisco 1131 c/ Concordia, Asunción**.
- Servicios Smart y el nuevo posicionamiento de MCA proceden directamente del documento de requerimientos que compartió el usuario. **No se han encontrado testimonios, portafolio Smart o datos de contacto independientes que permitan afirmar resultados, proyectos ejecutados o una unidad jurídica específica.**

Imágenes: las fotografías de proyectos enlazadas desde `static.wixstatic.com` corresponden a medios que aparecen en las páginas públicas de MCA; si fallan se usan fotografías de **Unsplash** como referencias. Antes de publicar oficialmente, confirmar licencias, fotografías auténticas, etapas, superficies, logos y permisos para reutilizar imágenes.

## Mantenimiento y carga de proyectos
Editar `assets/projects.json`: cada objeto contiene `title`, `category`, `location`, `area`, `description`, `scope`, `status`, `image`, `fallback`, `source`. La interfaz consulta automáticamente este archivo cuando se abre `proyectos.html` o `index.html`.
Para el sitio real se podría integrar un CMS (Decap CMS, Sanity u otro), con aprobación de usuario, roles y flujos de publicación. El prototipo no incorpora sistema de edición visual ni base de datos.

## Pendiente para la propuesta formal / producción
1. Aprobar identidad de MCA y Servicios Smart, logotipos y tonalidades.
2. Recibir planos, fotografías, videos, memorias técnicas y estados reales para cada proyecto.
3. Definir qué unidades son marcas comerciales y quién recibirá las consultas de Servicios Smart.
4. Activar formularios de envío real y correo corporativo usando infraestructura segura, con controles anti-spam y política de privacidad.
5. Confirmar dominio y hosting para cada marca; establecer condiciones de mantenimiento, seguridad y edición de contenidos.
6. Completar SEO corporativo (datos estructurados, sitemap, Search Console y páginas oficiales) **después de aprobar el contenido y dominio**.

## Pruebas
La acción `.github/workflows/mca-qa.yml` ejecuta Playwright Chromium: navegación, formularios, modal, filtros, mapa interactivo, escritorio y celular. Publica capturas de las páginas en artefactos. GitHub Pages sirve archivos estáticos desde `main`.

## Resguardo
La demo anterior del Centro Educativo de las Américas se preserva en la rama `backup/cela-before-mca-2026-11-02`.
