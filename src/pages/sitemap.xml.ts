import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { CATEGORIES } from '../lib/blog';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET(context: APIContext) {
  const site = context.site!;
  const posts = (await getCollection('blog')).sort(
    (a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
  );

  const newest = posts[0]?.data.pubDate;

  // Una entrada por sección con artículos (lastmod = el post más reciente).
  const categories = Object.keys(CATEGORIES)
    .map((key) => {
      const inCat = posts.filter((p) => (p.data.categories ?? []).includes(key));
      return { loc: `/blog/categoria/${key}/`, lastmod: inCat[0]?.data.pubDate, count: inCat.length };
    })
    .filter((c) => c.count > 0);

  const urls: { loc: string; lastmod?: string }[] = [
    { loc: '/', lastmod: newest },
    { loc: '/blog/', lastmod: newest },
    { loc: '/proyectos/' },
    ...categories.map(({ loc, lastmod }) => ({ loc, lastmod })),
    ...posts.map((p) => ({ loc: `/blog/${p.slug}/`, lastmod: p.data.pubDate })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${esc(new URL(u.loc, site).href)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
