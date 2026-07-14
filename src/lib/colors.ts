import type { ZoneColor } from "./types";

/**
 * Sistema visual: fondo claro + objetos con colores sólidos y oscuros por zona.
 * Fondos de acento en tono 200, bordes en 400, chips activos en tono 700.
 * Cada clase incluye su variante dark: (modo oscuro por clase, ver ThemeToggle).
 * Las clases están escritas completas para que Tailwind las detecte (sin interpolación).
 */
export interface ColorClasses {
  /** Punto/indicador sólido (acento) */
  dot: string;
  /** Texto de acento (horas, énfasis) */
  text: string;
  /** Fondo de acento */
  soft: string;
  /** Borde de acento (tarjetas, círculos del timeline) */
  border: string;
  /** Chip de navegación — activo (color pleno oscuro) */
  chipActive: string;
  /** Chip de navegación — inactivo (tinte fuerte del color de la zona) */
  chipIdle: string;
  /** Ring para resaltar "hoy" */
  ring: string;
  /** Borde de acento para actividades de viaje */
  travelBorder: string;
  travelSoft: string;
  /** Fondo degradado para el hero de la zona */
  hero: string;
  heroBorder: string;
}

const PALETTES: Record<ZoneColor, ColorClasses> = {
  verde: {
    dot: "bg-teal-700 dark:bg-teal-500",
    text: "text-teal-800 dark:text-teal-300",
    soft: "bg-teal-200 dark:bg-teal-900/50",
    border: "border-teal-400 dark:border-teal-700",
    chipActive: "bg-teal-700 text-white border-teal-700 shadow dark:bg-teal-600 dark:border-teal-600",
    chipIdle:
      "bg-teal-100 text-teal-900 border-teal-300 hover:border-teal-500 dark:bg-teal-950/60 dark:text-teal-200 dark:border-teal-800 dark:hover:border-teal-600",
    ring: "ring-teal-600/70",
    travelBorder: "border-teal-600 dark:border-teal-500",
    travelSoft: "bg-teal-200/70 dark:bg-teal-900/40",
    hero: "bg-gradient-to-br from-teal-200 via-teal-100 to-white dark:from-teal-950 dark:via-stone-900 dark:to-stone-950",
    heroBorder: "border-teal-400 dark:border-teal-800",
  },
  rojo: {
    dot: "bg-rose-700 dark:bg-rose-500",
    text: "text-rose-800 dark:text-rose-300",
    soft: "bg-rose-200 dark:bg-rose-900/50",
    border: "border-rose-400 dark:border-rose-700",
    chipActive: "bg-rose-700 text-white border-rose-700 shadow dark:bg-rose-600 dark:border-rose-600",
    chipIdle:
      "bg-rose-100 text-rose-900 border-rose-300 hover:border-rose-500 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800 dark:hover:border-rose-600",
    ring: "ring-rose-600/70",
    travelBorder: "border-rose-600 dark:border-rose-500",
    travelSoft: "bg-rose-200/70 dark:bg-rose-900/40",
    hero: "bg-gradient-to-br from-rose-200 via-rose-100 to-white dark:from-rose-950 dark:via-stone-900 dark:to-stone-950",
    heroBorder: "border-rose-400 dark:border-rose-800",
  },
  azul: {
    dot: "bg-sky-700 dark:bg-sky-500",
    text: "text-sky-800 dark:text-sky-300",
    soft: "bg-sky-200 dark:bg-sky-900/50",
    border: "border-sky-400 dark:border-sky-700",
    chipActive: "bg-sky-700 text-white border-sky-700 shadow dark:bg-sky-600 dark:border-sky-600",
    chipIdle:
      "bg-sky-100 text-sky-900 border-sky-300 hover:border-sky-500 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-800 dark:hover:border-sky-600",
    ring: "ring-sky-600/70",
    travelBorder: "border-sky-600 dark:border-sky-500",
    travelSoft: "bg-sky-200/70 dark:bg-sky-900/40",
    hero: "bg-gradient-to-br from-sky-200 via-sky-100 to-white dark:from-sky-950 dark:via-stone-900 dark:to-stone-950",
    heroBorder: "border-sky-400 dark:border-sky-800",
  },
  violeta: {
    dot: "bg-violet-700 dark:bg-violet-500",
    text: "text-violet-800 dark:text-violet-300",
    soft: "bg-violet-200 dark:bg-violet-900/50",
    border: "border-violet-400 dark:border-violet-700",
    chipActive:
      "bg-violet-700 text-white border-violet-700 shadow dark:bg-violet-600 dark:border-violet-600",
    chipIdle:
      "bg-violet-100 text-violet-900 border-violet-300 hover:border-violet-500 dark:bg-violet-950/60 dark:text-violet-200 dark:border-violet-800 dark:hover:border-violet-600",
    ring: "ring-violet-600/70",
    travelBorder: "border-violet-600 dark:border-violet-500",
    travelSoft: "bg-violet-200/70 dark:bg-violet-900/40",
    hero: "bg-gradient-to-br from-violet-200 via-violet-100 to-white dark:from-violet-950 dark:via-stone-900 dark:to-stone-950",
    heroBorder: "border-violet-400 dark:border-violet-800",
  },
  dorado: {
    dot: "bg-amber-600 dark:bg-amber-500",
    text: "text-amber-800 dark:text-amber-300",
    soft: "bg-amber-200 dark:bg-amber-900/50",
    border: "border-amber-400 dark:border-amber-700",
    chipActive:
      "bg-amber-600 text-white border-amber-600 shadow dark:bg-amber-500 dark:border-amber-500",
    chipIdle:
      "bg-amber-100 text-amber-900 border-amber-300 hover:border-amber-500 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800 dark:hover:border-amber-600",
    ring: "ring-amber-600/70",
    travelBorder: "border-amber-600 dark:border-amber-500",
    travelSoft: "bg-amber-200/70 dark:bg-amber-900/40",
    hero: "bg-gradient-to-br from-amber-200 via-amber-100 to-white dark:from-amber-950 dark:via-stone-900 dark:to-stone-950",
    heroBorder: "border-amber-400 dark:border-amber-800",
  },
  naranja: {
    dot: "bg-orange-700 dark:bg-orange-500",
    text: "text-orange-800 dark:text-orange-300",
    soft: "bg-orange-200 dark:bg-orange-900/50",
    border: "border-orange-400 dark:border-orange-700",
    chipActive:
      "bg-orange-700 text-white border-orange-700 shadow dark:bg-orange-600 dark:border-orange-600",
    chipIdle:
      "bg-orange-100 text-orange-900 border-orange-300 hover:border-orange-500 dark:bg-orange-950/60 dark:text-orange-200 dark:border-orange-800 dark:hover:border-orange-600",
    ring: "ring-orange-600/70",
    travelBorder: "border-orange-600 dark:border-orange-500",
    travelSoft: "bg-orange-200/70 dark:bg-orange-900/40",
    hero: "bg-gradient-to-br from-orange-200 via-orange-100 to-white dark:from-orange-950 dark:via-stone-900 dark:to-stone-950",
    heroBorder: "border-orange-400 dark:border-orange-800",
  },
  gris: {
    dot: "bg-slate-700 dark:bg-slate-400",
    text: "text-slate-800 dark:text-slate-300",
    soft: "bg-slate-200 dark:bg-slate-800/60",
    border: "border-slate-400 dark:border-slate-600",
    chipActive:
      "bg-slate-700 text-white border-slate-700 shadow dark:bg-slate-500 dark:border-slate-500",
    chipIdle:
      "bg-slate-100 text-slate-900 border-slate-300 hover:border-slate-500 dark:bg-slate-900/60 dark:text-slate-200 dark:border-slate-700 dark:hover:border-slate-500",
    ring: "ring-slate-600/70",
    travelBorder: "border-slate-600 dark:border-slate-400",
    travelSoft: "bg-slate-200/70 dark:bg-slate-800/40",
    hero: "bg-gradient-to-br from-slate-200 via-slate-100 to-white dark:from-slate-900 dark:via-stone-900 dark:to-stone-950",
    heroBorder: "border-slate-400 dark:border-slate-700",
  },
};

export function zoneColor(color: string): ColorClasses {
  return PALETTES[color as ZoneColor] ?? PALETTES.gris;
}

export type { ZoneColor };
