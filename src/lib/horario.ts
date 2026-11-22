import type { Franja } from '../data/trakas';

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const ZONA = 'America/Bogota';

const aMin = (h: string) => { const [hh, mm] = h.split(':').map(Number); return hh * 60 + mm; };

/** Día de la semana (0=domingo) y minuto del día en hora de Bogotá. */
function ahoraBogota(fecha: Date): { dia: number; min: number } {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: ZONA, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(fecha);
  const get = (t: string) => p.find((x) => x.type === t)!.value;
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { dia, min: Number(get('hour')) * 60 + Number(get('minute')) };
}

export function estadoHorario(ahora: Date, horario: Franja[]): { abierto: boolean; texto: string } {
  const { dia, min } = ahoraBogota(ahora);
  const semana = dia * 1440 + min; // minuto de la semana

  for (const f of horario) {
    const ini = f.dia * 1440 + aMin(f.abre);
    let fin = f.dia * 1440 + aMin(f.cierra);
    if (fin <= ini) fin += 1440; // cruza medianoche
    for (const off of [0, -7 * 1440]) { // contempla franja de sábado que termina el domingo
      if (semana >= ini + off && semana < fin + off) {
        return { abierto: true, texto: `Abierto — cerramos a las ${f.cierra}` };
      }
    }
  }

  // Próxima apertura
  let mejor: { delta: number; f: Franja } | null = null;
  for (const f of horario) {
    let delta = f.dia * 1440 + aMin(f.abre) - semana;
    if (delta <= 0) delta += 7 * 1440;
    if (!mejor || delta < mejor.delta) mejor = { delta, f };
  }
  if (!mejor) return { abierto: false, texto: 'Cerrado' };
  const cuando = mejor.f.dia === dia && mejor.delta < 1440 ? 'hoy' : mejor.f.dia === (dia + 1) % 7 ? 'mañana' : DIAS[mejor.f.dia];
  return { abierto: false, texto: `Cerrado — abrimos ${cuando} ${mejor.f.abre}` };
}
