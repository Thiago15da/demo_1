# Validación de la demostración

Fecha: 18/11/2026. Repositorio: Thiago15da/demo_1, rama main.

URL comprobada: https://thiago15da.github.io/demo_1/

## Producción

- `npm run build`: correcto, TypeScript y Vite sin errores.
- `npm run check:dist`: ocho entradas HTML, rutas de recursos, fuentes, favicon e imágenes responsivas correctos.
- GitHub Actions `44317219296`: compilación y despliegue correctos. Commit de implementación `8df842992ec264d0424f1d0c76d25f9190362142`.
- Las ocho páginas se abrieron directamente y se recargaron en el sitio publicado. Todas mostraron su título propio y contenido; no hubo errores 404 ni desbordamiento horizontal.
- Imágenes principales cargadas en las páginas empresariales. Revisión visual de portada, El Grupo, Empresas y perfil individual.

## Adaptación e interacciones

- Revisión en Chromium a 1363 px de escritorio, 909 px de ancho intermedio y 454/340 px de ancho pequeño mediante zoom de navegador. Los ocho documentos no presentan desbordamiento horizontal. Esto no sustituye pruebas en dispositivos físicos ni en Safari/iOS.
- Menú móvil: apertura, cierre con Escape y navegación a Contacto correctos.
- Áreas interactivas: cambio de especialidad y actualización de contenido correctos.
- Galería: ampliación, cierre con Escape y retorno de foco correctos.
- Contacto: destinatario por URL, selección empresarial, copia de consulta comprobada en portapapeles, enlace `mailto:` con asunto/cuerpo y teléfono `tel:` correctos. No se enviaron mensajes ni se hicieron llamadas.
- No se observaron errores propios de la aplicación. El navegador de prueba registra avisos de su extensión, ajenos a la web.
- Captura real del sitio publicado: `portada-publicada.jpg`.

## Validación pendiente del cliente

Nombre institucional, logos/colores oficiales, relación entre las empresas, alcance de actividades, contactos actuales y WhatsApp. Eco Asfalto requiere identificación inequívoca antes de añadir servicios. Sustituir imágenes ilustrativas por material propio autorizado cuando esté disponible. No existe recepción de formularios ni backend; la preparación de consulta es local.
