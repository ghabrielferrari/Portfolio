import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const localized = z.object({
  kind: z.string(), summary: z.string(), contribution: z.string(), note: z.string(),
});
const caption = z.object({ title: z.string(), implementation: z.string(), alt: z.string() });

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    id: z.enum(['carely', 'fintech', 'jordania']),
    name: z.string(),
    technologies: z.array(z.string()),
    pt: localized,
    en: localized,
    links: z.array(z.object({ url: z.url(), pt: z.string(), en: z.string() })),
    images: z.array(z.object({ src: image(), secondary: z.boolean(), pt: caption, en: caption })),
    evidenceLimits: z.array(z.string()),
  }),
});

export const collections = { projects };
