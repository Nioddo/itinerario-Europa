"use client";

import { useState } from "react";
import type { Day, ZoneColor } from "@/lib/types";
import { dayLabel, activityTimeRank } from "@/lib/format";
import { zoneColor } from "@/lib/colors";
import { ActivityItem } from "./ActivityItem";
import { ProposalItem } from "./ProposalItem";
import { ActivityModal, ProposalModal, DayNoteModal } from "./forms";
import { IconButton } from "./ui";

export function DayView({
  day,
  color,
  editor,
  isToday,
}: {
  day: Day;
  color: ZoneColor;
  editor: boolean;
  isToday: boolean;
}) {
  const c = zoneColor(color);
  const [addActivity, setAddActivity] = useState(false);
  const [addProposal, setAddProposal] = useState(false);
  const [editNote, setEditNote] = useState(false);

  const activities = [...day.activities].sort(
    (a, b) => activityTimeRank(a.hora) - activityTimeRank(b.hora) || a.orden - b.orden
  );

  return (
    <div className="animate-fade-in">
      {/* Encabezado del día */}
      <div className="mb-3 flex items-center gap-2 px-0.5">
        <h3 className="font-display text-xl font-bold capitalize">{dayLabel(day.fecha)}</h3>
        {isToday && (
          <span className={"rounded-full px-2 py-0.5 text-[11px] font-bold text-white " + c.dot}>
            HOY
          </span>
        )}
      </div>

      {/* Nota del día: visible para todos, editable en modo edición */}
      {day.nota_del_dia ? (
        <div
          className={
            "mb-4 flex items-start justify-between gap-2 rounded-xl px-3.5 py-2.5 " + c.soft
          }
        >
          <p className={"whitespace-pre-line text-sm font-medium " + c.text}>
            📝 {day.nota_del_dia}
          </p>
          {editor && (
            <IconButton title="Editar nota" onClick={() => setEditNote(true)}>
              ✏️
            </IconButton>
          )}
        </div>
      ) : (
        editor && (
          <button
            onClick={() => setEditNote(true)}
            className="mb-4 w-full rounded-xl border border-dashed border-stone-300 py-2 text-sm font-medium text-stone-500 transition hover:border-stone-400 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800/50"
          >
            📝 Agregar nota del día
          </button>
        )
      )}

      {/* Timeline de actividades */}
      {activities.length > 0 ? (
        <ol className="mt-1">
          {activities.map((a, i) => (
            <ActivityItem
              key={a.id}
              activity={a}
              color={color}
              editor={editor}
              last={i === activities.length - 1}
            />
          ))}
        </ol>
      ) : (
        <div className="rounded-2xl border border-dashed border-stone-300 py-8 text-center text-sm text-stone-400 dark:border-stone-700">
          Sin actividades fijas para este día.
        </div>
      )}

      {editor && (
        <button
          onClick={() => setAddActivity(true)}
          className="mt-1 w-full rounded-xl border border-dashed border-stone-300 py-2.5 text-sm font-medium text-stone-500 transition hover:border-stone-400 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800/50"
        >
          + Agregar actividad
        </button>
      )}

      {/* Propuestas */}
      {(day.proposals.length > 0 || editor) && (
        <div className="mt-5 rounded-2xl border border-dashed border-stone-400 bg-stone-50 p-3.5 dark:border-stone-600 dark:bg-stone-800/30">
          <p className="mb-2.5 flex items-center gap-1.5 px-1 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            💡 Propuestas
          </p>
          <div className="space-y-1.5">
            {day.proposals.map((p) => (
              <ProposalItem key={p.id} proposal={p} color={color} editor={editor} />
            ))}
            {day.proposals.length === 0 && editor && (
              <p className="px-1 py-1 text-sm text-stone-400">Todavía no hay propuestas.</p>
            )}
          </div>
          {editor && (
            <button
              onClick={() => setAddProposal(true)}
              className="mt-2 w-full rounded-xl border border-dashed border-stone-300 py-2 text-sm font-medium text-stone-500 transition hover:border-stone-400 hover:bg-white dark:border-stone-700 dark:hover:bg-stone-800/50"
            >
              + Agregar propuesta
            </button>
          )}
        </div>
      )}

      {addActivity && <ActivityModal dayId={day.id} onClose={() => setAddActivity(false)} />}
      {addProposal && <ProposalModal dayId={day.id} onClose={() => setAddProposal(false)} />}
      {editNote && (
        <DayNoteModal dayId={day.id} nota={day.nota_del_dia} onClose={() => setEditNote(false)} />
      )}
    </div>
  );
}
