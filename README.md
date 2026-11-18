# Grupo Empresarial — demostración institucional

Demo multipágina para GR Vallados, Del Sol Ingeniería S.A., Del Sol Constructora y Eco Asfalto S.A. Denominación e identidad del grupo provisionales.

## Desarrollo

React 19 + Vite 6 + TypeScript. Ocho entradas HTML reales: las páginas se pueden abrir y actualizar directamente en GitHub Pages sin redirecciones 404 ni enrutamiento simulado.

```sh
npm ci
npm run dev
npm run build
npm run check:dist
```

Ruta base: `/demo_1/`. Producción: `dist/`. El workflow `.github/workflows/deploy.yml` compila, comprueba recursos y publica con GitHub Pages. En Settings → Pages debe seleccionarse GitHub Actions como origen.

Componentes compartidos: `src/components.tsx`. Páginas: `src/pages/`. Información empresarial: `src/data.ts`. Cada empresa tiene su URL y su metadata HTML propia.

## Páginas

- Inicio: `/demo_1/`
- El Grupo: `grupo.html`
- Empresas: `empresas.html`
- GR Vallados: `gr-vallados.html`
- Del Sol Ingeniería S.A.: `del-sol-ingenieria.html`
- Del Sol Constructora: `del-sol-constructora.html`
- Eco Asfalto S.A.: `eco-asfalto.html`
- Contacto: `contacto.html`

## Contacto y alcance

El selector distingue a las cuatro empresas. La herramienta de redacción solo prepara/copia texto localmente; no envía, almacena ni registra información. Para Ingeniería se ofrece un enlace `mailto:` al correo publicado; para Ingeniería y Constructora, `tel:` al teléfono de directorios públicos. No se presume disponibilidad de WhatsApp. GR Vallados y Eco Asfalto no tienen canal directo confirmado en esta demo.

No incluye sistemas administrativos, formularios con recepción, servicios pagos, analítica, cookies de seguimiento ni claves privadas. No hay precios comerciales dentro de la web. Se utiliza `noindex,nofollow` para mantener la demostración pública fuera de la indexación solicitada a buscadores; no es una medida de privacidad.

## Investigación y confirmaciones

Ver `INVESTIGACION.md`. Ninguna imagen se presenta como obra propia. No se inventaron logos oficiales, certificaciones, clientes, cifras ni historia empresarial. La relación entre las cuatro empresas proviene del encargo del cliente y debe aprobarse junto con el nombre institucional definitivo.

## Material visual

`public/images/` contiene imágenes ilustrativas generadas para esta demostración, optimizadas en WebP a 800 y 1600 px. No son fotos documentales de las empresas. No hay marcas de terceros ni edificios identificables. Los nombres se muestran con tipografía editorial provisional, no con logos supuestamente oficiales.

Prompts y procedencia en `ASSETS.md`. Tipografía Geist (SIL OFL, Vercel) e Instrument Serif (SIL OFL, Instrument) alojadas localmente; licencias en `public/fonts/`.

Antes de una publicación definitiva, Rubén debe aprobar razón y nombre del grupo, logos, colores, servicios por empresa, contactos, permisos de fotos, textos e información legal. La página de Eco Asfalto tiene contenido referencial hasta verificar la identidad de la empresa correcta.
