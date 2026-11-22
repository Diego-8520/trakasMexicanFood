// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Dominio provisional hasta tener el definitivo (cambiar aquí y regenerar el QR).
export const SITE_URL = 'https://trakas-mexican-food.vercel.app';

export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap({ filter: (page) => !page.includes('/qr-poster') && !page.includes('/conceptos') })],
  build: { inlineStylesheets: 'always' },
});
