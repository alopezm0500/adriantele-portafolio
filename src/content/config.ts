import { defineCollection, z } from 'astro:content';
import { image } from 'astro:assets';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.string(),
      description: z.string(),
      categories: z.array(z.string()).default([]),
      heroImage: image().optional(),
    }),
});

export const collections = { blog };
