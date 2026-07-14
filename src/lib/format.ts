// Utilidades de fecha (puras, seguras en cliente y servidor).
// Las fechas vienen como "YYYY-MM-DD" y se tratan siempre en horario local
// para evitar corrimientos de un día por zona horaria.

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const DIAS_CORTO = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES_CORTO = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

export function parseLocal(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** "Lunes 20/7" */
export function dayLabel(iso: string): string {
  const dt = parseLocal(iso);
  return `${DIAS[dt.getDay()]} ${dt.getDate()}/${dt.getMonth() + 1}`;
}

/** "14 jul" */
export function shortDate(iso: string): string {
  const dt = parseLocal(iso);
  return `${dt.getDate()} ${MESES_CORTO[dt.getMonth()]}`;
}

/** "14 jul → 7 ago 2026" */
export function dateRange(fromIso: string, toIso: string): string {
  const to = parseLocal(toIso);
  return `${shortDate(fromIso)} → ${shortDate(toIso)} ${to.getFullYear()}`;
}

/** "14–19/7" compacto para chips */
export function compactRange(fromIso: string, toIso: string): string {
  const from = parseLocal(fromIso);
  const to = parseLocal(toIso);
  if (from.getMonth() === to.getMonth()) {
    return `${from.getDate()}–${to.getDate()}/${to.getMonth() + 1}`;
  }
  return `${from.getDate()}/${from.getMonth() + 1}–${to.getDate()}/${to.getMonth() + 1}`;
}

/** "Lun" */
export function weekdayShort(iso: string): string {
  return DIAS_CORTO[parseLocal(iso).getDay()];
}

/** Día del mes como número. */
export function dayNumber(iso: string): number {
  return parseLocal(iso).getDate();
}

/**
 * Rango horario para ordenar actividades: primero por hora real, después las
 * franjas textuales (Mañana/Mediodía/Tarde/Noche) y al final las que no tienen hora.
 */
export function activityTimeRank(hora: string | null): number {
  if (!hora) return 100_000;
  const m = hora.match(/^\s*(\d{1,2}):(\d{2})/);
  if (m) return Number(m[1]) * 60 + Number(m[2]);
  const norm = hora
    .toLowerCase()
    .replace(/[áàä]/g, "a")
    .replace(/[éèë]/g, "e")
    .replace(/[íìï]/g, "i")
    .replace(/[óòö]/g, "o")
    .replace(/[úùü]/g, "u");
  if (norm.includes("madrugada")) return 5 * 60;
  if (norm.includes("manana")) return 9 * 60;
  if (norm.includes("mediodia")) return 13 * 60;
  if (norm.includes("tarde")) return 16 * 60;
  if (norm.includes("noche")) return 21 * 60;
  return 50_000;
}

/** Fecha de hoy del dispositivo como "YYYY-MM-DD" (horario local). */
export function localTodayISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}
