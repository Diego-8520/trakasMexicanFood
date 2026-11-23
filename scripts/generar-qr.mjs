// Genera el QR del menú (SVG + PNG 2048 px) en public/qr/.
// Uso: npm run qr   (toma el dominio de SITE_URL en astro.config.mjs)
import QRCode from 'qrcode';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OPCIONES = { errorCorrectionLevel: 'H', margin: 4, color: { dark: '#141110', light: '#FFFFFF' } };

/** URL que abre el QR de las mesas. */
export const urlMenuQR = (site) => `${site.replace(/\/$/, '')}/menu?utm_source=qr`;

export async function generarQR(url, destino) {
  await mkdir(destino, { recursive: true });
  await writeFile(join(destino, 'menu-qr.svg'), await QRCode.toString(url, { ...OPCIONES, type: 'svg' }));
  await QRCode.toFile(join(destino, 'menu-qr-2048.png'), url, { ...OPCIONES, type: 'png', width: 2048 });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { SITE_URL } = await import('../astro.config.mjs');
  const url = urlMenuQR(SITE_URL);
  await generarQR(url, 'public/qr');
  console.log(`QR generado en public/qr/ → ${url}`);
}
