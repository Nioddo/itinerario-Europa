"use client";

import { useState } from "react";
import type { Zone } from "@/lib/types";
import { dateRange } from "@/lib/format";
import { zoneColor } from "@/lib/colors";
import { IconButton } from "./ui";
import { AlojamientoModal } from "./forms";

export function ZoneHero({ zone, editor }: { zone: Zone; editor: boolean }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const c = zoneColor(zone.color);
  // Solo se muestra el botón si hay un link cargado explícitamente.
  const maps = zone.link_alojamiento;

  return (
    <div className={`overflow-hidden rounded-2xl border shadow-sm ${c.heroBorder} ${c.hero}`}>
      <div className="px-5 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl font-bold leading-tight">{zone.nombre}</h2>
          <span className={`shrink-0 text-sm font-semibold ${c.text}`}>
            {dateRange(zone.fecha_desde, zone.fecha_hasta)}
          </span>
        </div>
        {zone.subtitulo && (
          <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">{zone.subtitulo}</p>
        )}
      </div>

      {(zone.info_alojamiento || editor) && (
        <div className={`border-t ${c.heroBorder}`}>
          <div className="flex items-center gap-2 pr-3">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex min-w-0 flex-1 items-center justify-between gap-2 px-5 py-3 text-left"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-stone-700 dark:text-stone-300">
                🏠 Alojamiento
              </span>
              <span
                className={`text-xs text-stone-400 transition-transform ${open ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>
            {editor && (
              <IconButton title="Editar alojamiento" onClick={() => setEditing(true)}>
                ✏️
              </IconButton>
            )}
          </div>
          {open && (
            <div className="animate-fade-in px-5 pb-4">
              {zone.info_alojamiento ? (
                <p className="whitespace-pre-line text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                  {zone.info_alojamiento}
                </p>
              ) : (
                <p className="text-sm text-stone-400">
                  Todavía no hay info del alojamiento. Tocá ✏️ para agregarla.
                </p>
              )}
              {maps && (
                <a
                  href={maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-3 inline-flex items-center gap-1.5 rounded-full border bg-white px-3.5 py-1.5 text-sm font-medium shadow-sm transition hover:shadow dark:bg-stone-900 ${c.heroBorder} ${c.text}`}
                >
                  📍 Ver alojamiento
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {editing && <AlojamientoModal zone={zone} onClose={() => setEditing(false)} />}
    </div>
  );
}
