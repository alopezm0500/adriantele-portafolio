import { defineConfig } from 'astro/config';

// https://astro.build/config
// El dominio del sitio se define en un solo lugar: cambiar PUBLIC_SITE_URL
// (variable de entorno en Cloudflare Pages) actualiza canonicals, sitemap y RSS.
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'https://adriantele-portafolio.pages.dev',
  trailingSlash: 'always',
});
