import { test, expect } from '@playwright/test';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
import { SITE_URL } from '../../astro.config.mjs';

test('tarjeta QR: no indexable y el QR impreso lleva a /menu', async ({ page }) => {
  await page.goto('/qr-poster');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  const qr = page.locator('img.qr');
  await expect(qr).toBeVisible();
  const png = PNG.sync.read(await qr.screenshot());
  const r = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  expect(r?.data).toBe(`${SITE_URL}/menu?utm_source=qr`);
});

test('la tarjeta no aparece en el sitemap', async ({ request }) => {
  const xml = await (await request.get('/sitemap-0.xml')).text();
  expect(xml).toContain('/menu');
  expect(xml).not.toContain('qr-poster');
});
