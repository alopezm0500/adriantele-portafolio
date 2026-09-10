import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { catName } from '../lib/blog';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
  );
  return rss({
    title: 'Tech con Sentido — Telecom, IA y tecnología con pensamiento crítico',
    description: 'Artículos sobre telecomunicaciones, IA y tecnología con pensamiento crítico.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.pubDate),
      link: `/blog/${post.slug}/`,
      categories: post.data.categories.map(catName),
    })),
  });
}
