"use client";

import { useEffect, useRef } from "react";
import type { Day, ZoneColor } from "@/lib/types";
import { weekdayShort, dayNumber } from "@/lib/format";
import { zoneColor } from "@/lib/colors";

export function DayTabs({
  days,
  active,
  onSelect,
  color,
  today,
}: {
  days: Day[];
  active: string;
  onSelect: (id: string) => void;
  color: ZoneColor;
  today: string | null;
}) {
  const c = zoneColor(color);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowRef.current?.querySelector<HTMLElement>(`[data-day="${active}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  return (
    <div ref={rowRef} className="no-scrollbar flex gap-2 overflow-x-auto">
      {days.map((d) => {
        const isActive = d.id === active;
        const isToday = d.fecha === today;
        return (
          <button
            key={d.id}
            data-day={d.id}
            onClick={() => onSelect(d.id)}
            className={
              "relative flex w-14 shrink-0 flex-col items-center rounded-xl border py-1.5 transition active:scale-95 " +
              (isActive ? c.chipActive : c.chipIdle)
            }
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
              {weekdayShort(d.fecha)}
            </span>
            <span className="text-lg font-bold leading-none">{dayNumber(d.fecha)}</span>
            {isToday && (
              <span
                className={
                  "absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-stone-950 " + c.dot
                }
                aria-label="Hoy"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
