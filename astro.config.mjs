import { defineConfig } from 'astro/config';
import { rehypeHeadingIds } from './src/lib/toc.mjs';

// https://astro.build/config
// El dominio del sitio se define en un solo lugar: cambiar PUBLIC_SITE_URL
// (variable de entorno en Cloudflare Pages) actualiza canonicals, sitemap y RSS.
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'https://adriantele-portafolio.pages.dev',
  trailingSlash: 'always',
  markdown: {
    // Agrega ids a los encabezados (h2/h3) para el TOC sticky del artículo.
    // Plugin propio, sin dependencias nuevas.
    rehypePlugins: [rehypeHeadingIds],
  },
});
