import type { APIContext } from 'astro';

/**
 * Índice de sitemaps. Algunos buscadores/validadores piden /sitemap-index.xml
 * por convención (era 404). Apunta al sitemap real, que sigue siendo /sitemap.xml.
 */
export async function GET(context: APIContext) {
  const site = context.site!;
  const today = new Date().toISOString().slice(0, 10);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${new URL('/sitemap.xml', site).href}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
