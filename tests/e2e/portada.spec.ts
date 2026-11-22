import { test, expect } from '@playwright/test';

test('el póster del hero es la imagen prioritaria (LCP), no un video', async ({ page }) => {
  await page.goto('/');
  const poster = page.locator('[data-video="hero"] img.vs__poster');
  await expect(poster).toHaveAttribute('fetchpriority', 'high');
  await expect(poster).toHaveAttribute('loading', 'eager');
});

test('el Chile anfitrión se ve en la primera pantalla (concepto B)', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1500); // termina la animación de entrada
  const chile = page.locator('[data-mascota-hero]');
  await expect(chile).toBeVisible();
  const caja = (await chile.boundingBox())!;
  const vh = page.viewportSize()!.height;
  expect(caja.y).toBeLessThan(vh);              // aparece sin desplazarse
  expect(caja.y + caja.height).toBeLessThanOrEqual(vh);
  expect(caja.height).toBeGreaterThanOrEqual(vh * 0.15);
});

test('secciones con anclas para la navegación', async ({ page }) => {
  await page.goto('/');
  for (const id of ['menu', 'chile', 'nosotros', 'domicilios', 'ubicacion']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test('"Ver el menú" lleva a /menu y hay CTA de WhatsApp', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /ver el men[uú]/i }).first()).toHaveAttribute('href', '/menu');
  await expect(page.locator('a[href^="https://wa.me/573203172184"]').first()).toBeVisible();
});

test('datos estructurados Restaurant presentes y válidos', async ({ page }) => {
  await page.goto('/');
  const json = await page.locator('script[type="application/ld+json"]').first().textContent();
  const data = JSON.parse(json!);
  expect(data['@type']).toBe('Restaurant');
  expect(data.menu).toMatch(/\/menu$/);
});

test('platos estrella vienen de los datos (destacados primero)', async ({ page }) => {
  await page.goto('/');
  const caps = page.locator('#menu [data-capitulo]');
  await expect(caps.first()).toContainText('Tacos de Birria');
  await expect(caps.nth(1)).toContainText('Birria Ramen');
});

test('sin desplazamiento horizontal en móvil', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  // el navegador móvil no debe alejar la página para que quepa contenido desbordado
  expect(await page.evaluate(() => innerWidth)).toBe(page.viewportSize()!.width);
  const extra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(extra).toBeLessThanOrEqual(0);
});

test('JavaScript total de la portada < 15 KB', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const js = await page.evaluate(() =>
    (performance.getEntriesByType('resource') as PerformanceResourceTiming[])
      .filter((r) => r.initiatorType === 'script' || r.name.endsWith('.js'))
      .reduce((s, r) => s + r.encodedBodySize, 0));
  const inline = await page.evaluate(() => [...document.querySelectorAll('script:not([src]):not([type="application/ld+json"])')].reduce((s, e) => s + (e.textContent?.length ?? 0), 0));
  console.log(`JS portada: ${((js + inline) / 1024).toFixed(1)} KB`);
  expect(js + inline).toBeLessThan(15 * 1024);
});

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('el contenido principal se lee igual', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('#menu')).toContainText('$25.000');
    await expect(page.locator('#ubicacion [data-horario]')).toContainText('12:00');
  });
});

test('carrusel de platos accesible por teclado', async ({ page }) => {
  await page.goto('/');
  const pista = page.locator('#menu .caps__pista');
  await expect(pista).toHaveAttribute('tabindex', '0');
  await expect(pista).toHaveAttribute('aria-label', /platos/i);
});

test('móvil: hay acceso al menú desde la cabecera', async ({ page }) => {
  await page.goto('/');
  const enlace = page.locator('.nav a[href="/menu"]');
  await expect(enlace).toBeVisible();
  expect((await enlace.boundingBox())!.height).toBeGreaterThanOrEqual(44);
});


test('móvil: "Pedir por WhatsApp" se ve completo sin desplazar', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1500); // animaciones de entrada
  const cta = page.locator('.hero .ctas a').first();
  const caja = (await cta.boundingBox())!;
  expect(caja.y + caja.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  // el Chile no tapa los botones
  const chile = (await page.locator('[data-mascota-hero]').boundingBox())!;
  for (const b of await page.locator('.hero .ctas a').all()) {
    const c = (await b.boundingBox())!;
    expect(c.y + c.height <= chile.y + 10 || c.x + c.width <= chile.x).toBe(true);
  }
});

test.describe('escritorio', () => {
  test.use({ viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false });
  test('enlaces del menú superior con objetivo de 44 px', async ({ page }) => {
    await page.goto('/');
    for (const a of await page.locator('.nav__links a').all()) {
      expect((await a.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
  });
  test('sin desplazamiento horizontal', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  });
});

test('metadatos para compartir: tipo website e imagen con URL absoluta', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\/.+\.(jpe?g|png|webp)$/);
});
