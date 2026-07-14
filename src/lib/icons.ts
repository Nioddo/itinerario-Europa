import type { Activity } from "./types";

/** Emoji representativo de una actividad según su tipo / medio de viaje. */
export function activityIcon(a: Pick<Activity, "tipo" | "medio_viaje">): string {
  if (a.tipo === "viaje") {
    switch (a.medio_viaje) {
      case "avion":
        return "✈️";
      case "tren":
        return "🚆";
      case "auto":
        return "🚗";
      default:
        return "🧭";
    }
  }
  if (a.tipo === "comida") return "🍽️";
  return "📍";
}

export const TRAVEL_MODES: { value: string; label: string; icon: string }[] = [
  { value: "avion", label: "Avión ✈️", icon: "✈️" },
  { value: "tren", label: "Tren 🚆", icon: "🚆" },
  { value: "auto", label: "Auto 🚗", icon: "🚗" },
];

export const ACTIVITY_TYPES: { value: string; label: string }[] = [
  { value: "actividad", label: "Actividad 📍" },
  { value: "viaje", label: "Viaje ✈️🚆🚗" },
  { value: "comida", label: "Comida 🍽️" },
];
