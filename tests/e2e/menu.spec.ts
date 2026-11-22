import { test, expect } from '@playwright/test';
import { gzipSync } from 'node:zlib';

const URL_QR = '/menu?utm_source=qr';

test('QR abre /menu directo, sin redirección', async ({ page }) => {
  const res = await page.goto(URL_QR);
  expect(res?.status()).toBe(200);
  expect(res?.request().redirectedFrom()).toBeNull();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/men[uú]/i);
});

test('muestra los 7 platos con precio y "Pregunta" en bebidas', async ({ page }) => {
  await page.goto(URL_QR);
  await expect(page.locator('[data-plato]')).toHaveCount(7);
  await expect(page.locator('[data-plato="birria"]')).toContainText('$25.000');
  await expect(page.locator('#bebidas')).toContainText('Pregunta');
  await expect(page.locator('#proteinas')).toContainText('Chanchullo');
});

test('botón fijo de WhatsApp apunta al número del negocio', async ({ page }) => {
  await page.goto(URL_QR);
  const cta = page.locator('[data-whatsapp-fijo]');
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', /^https:\/\/wa\.me\/573203172184/);
});

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('los precios y el horario siguen visibles', async ({ page }) => {
    await page.goto(URL_QR);
    await expect(page.locator('[data-plato="ramen"]')).toContainText('$20.000');
    await expect(page.locator('[data-horario]')).toContainText('12:00');
  });
});

test('estado abierto/cerrado se calcula en el navegador', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-23T15:00:00-05:00')); // lunes
  await page.goto(URL_QR);
  await expect(page.locator('[data-estado]').first()).toHaveText('Cerrado — abrimos miércoles 12:00');
});

test('peso total transferido < 100 KB (HTML comprimido como en Vercel)', async ({ page }) => {
  const res = await page.goto(URL_QR, { waitUntil: 'networkidle' });
  const html = gzipSync(await res!.body()).length;
  const recursos = await page.evaluate(() =>
    (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).reduce((s, r) => s + r.encodedBodySize, 0));
  const total = html + recursos;
  const lista = await page.evaluate(() =>
    (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).map((r) => `${(r.encodedBodySize / 1024).toFixed(1)}KB ${r.name.split('/').pop()}`));
  console.log(`/menu transfiere ${(total / 1024).toFixed(1)} KB (HTML gzip ${(html / 1024).toFixed(1)} KB)\n  ${lista.join('\n  ')}`);
  expect(total).toBeLessThan(100 * 1024);
});

test('sin desplazamiento horizontal en móvil', async ({ page }) => {
  await page.goto(URL_QR);
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(ancho).toBeLessThanOrEqual(0);
});
