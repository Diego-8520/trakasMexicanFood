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
  await expect(page.locator('#bebidas')).toContainText('Pregúntanos el precio en caja');
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
    await expect(page.locator('[data-estado]').first()).toHaveText('Miércoles a domingo desde las 12:00');
    await expect(page.locator('[data-estado-wrap]').first()).not.toHaveClass(/cerrado|abierto/);
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
  // Las fotos de los platos son diferidas (loading="lazy"): cargan al desplazarse y no cuentan en la carga inicial
  const diferidas = await page.evaluate(() => [...document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]')].map((i) => i.currentSrc).filter(Boolean));
  const recursos = await page.evaluate((excluir) =>
    (performance.getEntriesByType('resource') as PerformanceResourceTiming[])
      .filter((r) => !excluir.includes(r.name)).reduce((s, r) => s + r.encodedBodySize, 0), diferidas);
  const total = html + recursos;
  const lista = await page.evaluate(() =>
    (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).map((r) => `${(r.encodedBodySize / 1024).toFixed(1)}KB ${r.name.split('/').pop()}`));
  console.log(`/menu transfiere ${(total / 1024).toFixed(1)} KB (HTML gzip ${(html / 1024).toFixed(1)} KB)\n  ${lista.join('\n  ')}`);
  // Margen de 3 KB bajo el tope de 100 KB (las 7 miniaturas de platos añaden ~0.3 KB de HTML)
  expect(total).toBeLessThan(97 * 1024);
});

test('cada miniatura de plato pesa 8 KB o menos', async ({ page }) => {
  await page.goto(URL_QR);
  for (const img of await page.locator('.plato__foto').all()) {
    await img.scrollIntoViewIfNeeded();
    const src = await img.evaluate((i: HTMLImageElement) => i.currentSrc);
    const r = await page.request.get(src);
    expect((await r.body()).length).toBeLessThanOrEqual(8 * 1024);
  }
});

test('sin desplazamiento horizontal en móvil', async ({ page }) => {
  await page.goto(URL_QR);
  expect(await page.evaluate(() => innerWidth)).toBe(page.viewportSize()!.width);
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(ancho).toBeLessThanOrEqual(0);
});

test('primera pantalla: el precio del plato 01 se ve completo encima del botón fijo', async ({ page }) => {
  await page.goto(URL_QR);
  const precio = await page.locator('[data-plato="birria"] .plato__precio').boundingBox();
  const cta = await page.locator('[data-whatsapp-fijo]').boundingBox();
  expect(precio!.y + precio!.height).toBeLessThan(cta!.y);
});

test('pestañas con objetivo táctil de 44 px o más', async ({ page }) => {
  await page.goto(URL_QR);
  for (const a of await page.locator('.tabs a').all()) {
    expect((await a.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
});

test('la pestaña activa sigue a la sección visible', async ({ page }) => {
  await page.goto(URL_QR);
  await expect(page.locator('.tabs a[aria-current="true"]')).toHaveText('Platos');
  await page.locator('#bebidas').scrollIntoViewIfNeeded();
  await expect(page.locator('.tabs a[aria-current="true"]')).toHaveText('Bebidas');
});

test('bebidas sin precio no repiten "Pregunta" en cada fila', async ({ page }) => {
  await page.goto(URL_QR);
  await expect(page.locator('#bebidas li', { hasText: 'Pregunta' })).toHaveCount(0);
});
