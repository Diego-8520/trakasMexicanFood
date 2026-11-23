// Carga diferida de videos de fondo: nada se descarga hasta que la sección entra en pantalla.
// Con movimiento reducido o ahorro de datos, se quedan los pósters.

const sinVideo = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches ||
  (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

// Escritorio (≥ 900 px): el video ocupa buena parte del ancho y con 720 se ve blando → 1080 si el ancho
// en píxeles reales supera 1100. En celular y tableta vertical se queda en 720 para ahorrar datos.
const resolucion = () => (innerWidth >= 900 && innerWidth * Math.min(devicePixelRatio, 2) > 1100 ? 1080 : 720);

function cargar(v: HTMLVideoElement) {
  if (v.dataset.cargado) return;
  v.dataset.cargado = '1';
  const base = `${v.dataset.src}-${resolucion()}`;
  for (const [ext, type] of [['webm', 'video/webm; codecs="av01.0.05M.08"'], ['mp4', 'video/mp4']]) {
    const s = document.createElement('source');
    s.src = `${base}.${ext}`;
    s.type = type;
    v.append(s);
  }
  v.addEventListener('playing', () => v.classList.add('listo'), { once: true });
  v.load();
}

let iniciado = false;
export function iniciarVideos() {
  if (iniciado || sinVideo()) return;
  iniciado = true;

  const obs = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting) { cargar(v); v.play().catch(() => {}); }
      else if (v.dataset.cargado) v.pause();
    }
  }, { rootMargin: '150px 0px' });

  const observar = (sel: string) => document.querySelectorAll<HTMLVideoElement>(sel).forEach((v) => obs.observe(v));
  observar('[data-video]:not([data-prioridad]) video');
  // El hero espera a que la página termine de cargar para no competir con el póster (LCP)
  const hero = () => observar('[data-video][data-prioridad] video');
  if (document.readyState === 'complete') hero(); else addEventListener('load', hero, { once: true });
}
