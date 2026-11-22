import { test, expect, type Page } from '@playwright/test';

const pidioVideo = (urls: string[], clip: string) => urls.some((u) => u.includes(`/videos/${clip}-`));
function registrar(page: Page) {
  const urls: string[] = [];
  page.on('request', (r) => { if (/\.(webm|mp4)(\?|$)/.test(r.url())) urls.push(r.url()); });
  return urls;
}

test('el video de una sección no se descarga hasta que entra en pantalla', async ({ page }) => {
  const urls = registrar(page);
  await page.goto('/', { waitUntil: 'networkidle' });
  expect(pidioVideo(urls, 'chile-zoom')).toBe(false);
  await page.locator('[data-video="chile-zoom"]').scrollIntoViewIfNeeded();
  await expect.poll(() => pidioVideo(urls, 'chile-zoom')).toBe(true);
  await expect.poll(() => urls.some((u) => u.includes('chile-zoom-720'))).toBe(true); // móvil → 720p
});

test.describe('movimiento reducido', () => {
  test.use({ reducedMotion: 'reduce' });
  test('nunca pide video y deja el póster', async ({ page }) => {
    const urls = registrar(page);
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('[data-video="chile-zoom"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    expect(urls).toEqual([]);
    await expect(page.locator('[data-video="chile-zoom"] img')).toBeVisible();
  });
});

test('ahorro de datos: nunca pide video', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true } }));
  const urls = registrar(page);
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.locator('[data-video="chile-zoom"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  expect(urls).toEqual([]);
});

test('clip que aún no existe: solo póster, sin <video> ni errores en consola', async ({ page }) => {
  const errores: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  await page.goto('/', { waitUntil: 'networkidle' });
  const hero = page.locator('[data-video="hero"]');
  await expect(hero.locator('img')).toBeVisible();
  await expect(hero.locator('video')).toHaveCount(0);
  expect(errores).toEqual([]);
});
