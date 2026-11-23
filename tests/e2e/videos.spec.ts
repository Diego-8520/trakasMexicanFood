import { test, expect, type Page } from '@playwright/test';
import { existsSync } from 'node:fs';

// Estas pruebas no dependen de qué clips existan: siguen valiendo cuando lleguen los videos reales.
const SECCION_CON_VIDEO = '[data-video]:not([data-prioridad]):has(video)';

function registrar(page: Page) {
  const urls: string[] = [];
  page.on('request', (r) => { if (/\.(webm|mp4)(\?|$)/.test(r.url())) urls.push(r.url()); });
  return urls;
}

test('el video de una sección no se descarga hasta que entra en pantalla', async ({ page }) => {
  const urls = registrar(page);
  await page.goto('/', { waitUntil: 'networkidle' });
  const seccion = page.locator(SECCION_CON_VIDEO).last();
  const clip = await seccion.getAttribute('data-video');
  const pidio = () => urls.some((u) => u.includes(`/videos/${clip}-`));
  expect(pidio()).toBe(false);
  await seccion.scrollIntoViewIfNeeded();
  await expect.poll(pidio).toBe(true);
  await expect.poll(() => urls.some((u) => u.includes(`/videos/${clip}-720`))).toBe(true); // móvil → 720p
});

test.describe('movimiento reducido', () => {
  test.use({ reducedMotion: 'reduce' });
  test('nunca pide video y deja el póster', async ({ page }) => {
    const urls = registrar(page);
    await page.goto('/', { waitUntil: 'networkidle' });
    const seccion = page.locator(SECCION_CON_VIDEO).last();
    await seccion.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    expect(urls).toEqual([]);
    await expect(seccion.locator('img')).toBeVisible();
  });
});

test('ahorro de datos: nunca pide video', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true } }));
  const urls = registrar(page);
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.locator(SECCION_CON_VIDEO).last().scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  expect(urls).toEqual([]);
});

test('clip del hero que aún no existe: solo póster, sin <video> ni errores en consola', async ({ page }) => {
  test.skip(existsSync('public/videos/hero-720.mp4'), 'el video del hero ya existe');
  const errores: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  await page.goto('/', { waitUntil: 'networkidle' });
  const hero = page.locator('[data-video="hero"]');
  await expect(hero.locator('img')).toBeVisible();
  await expect(hero.locator('video')).toHaveCount(0);
  expect(errores).toEqual([]);
});

test('ninguna página muestra [marcadores] sin completar', async ({ page }) => {
  for (const ruta of ['/', '/menu']) {
    await page.goto(ruta);
    expect(await page.content()).not.toMatch(/\[(Calle|Ciudad|Barrio|Departamento|TU-|usuario|pagina|CONFIRMAR)/);
  }
});
