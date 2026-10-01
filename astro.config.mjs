import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://ghabrielferrari.github.io',
  base: '/Portfolio/',
  output: 'static',
  integrations: [react()],
  trailingSlash: 'always',
  build: { format: 'directory' },
});
