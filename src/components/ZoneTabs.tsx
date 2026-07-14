"use client";

import { useEffect, useRef } from "react";
import type { Zone } from "@/lib/types";
import { compactRange } from "@/lib/format";
import { zoneColor } from "@/lib/colors";

export function ZoneTabs({
  zones,
  active,
  onSelect,
}: {
  zones: Zone[];
  active: string;
  onSelect: (id: string) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowRef.current?.querySelector<HTMLElement>(`[data-zone="${active}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  return (
    <div ref={rowRef} className="no-scrollbar flex gap-1.5 overflow-x-auto">
      {zones.map((z) => {
        const isActive = z.id === active;
        const c = zoneColor(z.color);
        return (
          <button
            key={z.id}
            data-zone={z.id}
            onClick={() => onSelect(z.id)}
            className={
              "flex shrink-0 items-baseline gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-95 " +
              (isActive ? c.chipActive : c.chipIdle)
            }
          >
            {z.nombre}
            <span className={"text-[11px] font-medium " + (isActive ? "opacity-80" : "opacity-60")}>
              {compactRange(z.fecha_desde, z.fecha_hasta)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
