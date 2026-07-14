"use client";

import { useEffect, useState } from "react";
import type { Itinerary as ItineraryData } from "@/lib/types";
import { dateRange, localTodayISO } from "@/lib/format";
import { ZoneTabs } from "./ZoneTabs";
import { DayTabs } from "./DayTabs";
import { ZoneHero } from "./ZoneHero";
import { DayView } from "./DayView";
import { LockButton } from "./LockButton";
import { ThemeToggle } from "./ThemeToggle";

export function Itinerary({
  data,
  editor,
  isDemo,
}: {
  data: ItineraryData;
  editor: boolean;
  isDemo: boolean;
}) {
  const zones = data.zones;
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? "");
  const [dayId, setDayId] = useState(zones[0]?.days[0]?.id ?? "");
  const [today, setToday] = useState<string | null>(null);

  const activeZone = zones.find((z) => z.id === zoneId) ?? zones[0];
  const activeDay = activeZone?.days.find((d) => d.id === dayId) ?? activeZone?.days[0];

  // Al montar: fecha del dispositivo y salto automático al día de hoy (si está en el viaje).
  useEffect(() => {
    const t = localTodayISO();
    setToday(t);
    for (const z of zones) {
      const d = z.days.find((x) => x.fecha === t);
      if (d) {
        setZoneId(z.id);
        setDayId(d.id);
        break;
      }
    }
  }, [zones]);

  function selectZone(id: string) {
    const z = zones.find((x) => x.id === id);
    if (!z) return;
    setZoneId(id);
    const todayDay = today ? z.days.find((d) => d.fecha === today) : null;
    setDayId((todayDay ?? z.days[0])?.id ?? "");
  }

  function goToday() {
    if (!today) return;
    for (const z of zones) {
      const d = z.days.find((x) => x.fecha === today);
      if (d) {
        setZoneId(z.id);
        setDayId(d.id);
        return;
      }
    }
  }

  const todayInTrip = today != null && zones.some((z) => z.days.some((d) => d.fecha === today));

  if (!activeZone || !activeDay) return null;

  return (
    <main className="mx-auto max-w-2xl px-4 pb-28">
      {/* Encabezado del viaje */}
      <header className="pb-5 pt-9 text-center sm:pt-12">
        <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
          {data.viaje.subtitulo}
        </p>
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
          {data.viaje.titulo}
        </h1>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-1.5 text-sm font-semibold text-white shadow">
          🗓️ {dateRange(data.viaje.fecha_desde, data.viaje.fecha_hasta)}
        </p>
      </header>

      {/* Selectores sticky: zona + día */}
      <div className="sticky top-0 z-30 -mx-4 mb-5 border-b border-stone-300 bg-white/95 px-4 pb-3 pt-3 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/90">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <ZoneTabs zones={zones} active={activeZone.id} onSelect={selectZone} />
          </div>
          {todayInTrip && (
            <button
              onClick={goToday}
              className="shrink-0 self-stretch rounded-full border border-orange-700 bg-orange-600 px-3.5 text-sm font-semibold text-white shadow transition hover:bg-orange-700 active:scale-95"
            >
              Hoy
            </button>
          )}
        </div>
        <div className="mt-2.5">
          <DayTabs
            days={activeZone.days}
            active={activeDay.id}
            onSelect={setDayId}
            color={activeZone.color}
            today={today}
          />
        </div>
      </div>

      {isDemo && (
        <div className="mb-5 rounded-2xl border border-amber-400 bg-amber-200 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
          <strong>Modo demo.</strong> Estás viendo datos de ejemplo. Configurá Supabase (ver{" "}
          <code>README.md</code>) para guardar cambios de verdad.
        </div>
      )}

      <ZoneHero zone={activeZone} editor={editor} />

      <div className="mt-5">
        <DayView
          key={activeDay.id}
          day={activeDay}
          color={activeZone.color}
          editor={editor}
          isToday={today === activeDay.fecha}
        />
      </div>

      <footer className="mt-14 text-center text-xs text-stone-400 dark:text-stone-600">
        ✈️ Buen viaje · Europa 2026
      </footer>

      <ThemeToggle />
      <LockButton editor={editor} />
    </main>
  );
}
