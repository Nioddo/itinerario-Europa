"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Activity, ZoneColor } from "@/lib/types";
import { activityIcon } from "@/lib/icons";
import { zoneColor } from "@/lib/colors";
import { IconButton, ConfirmDialog } from "./ui";
import { ActivityModal, LinkModal, PdfModal } from "./forms";
import { deleteActivity, deleteAttachment } from "@/lib/actions";

function pdfUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/tickets/${storagePath}`;
}

/** Sección con título dentro de la tarjeta (Documentos / Links). */
function AttachmentSection({
  title,
  empty,
  editor,
  onAdd,
  addLabel,
  tint,
  children,
}: {
  title: string;
  empty: string;
  editor: boolean;
  onAdd: () => void;
  addLabel: string;
  /** Clase de fondo suave (color de la zona). */
  tint: string;
  children: React.ReactNode;
}) {
  const hasItems = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <div className={"mt-3 rounded-xl p-2.5 " + tint}>
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
        {title}
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        {hasItems ? children : <span className="text-xs text-stone-400">{empty}</span>}
        {editor && (
          <button
            onClick={onAdd}
            className="rounded-full border border-dashed border-stone-300 bg-white px-2.5 py-1 text-xs font-medium text-stone-500 transition hover:border-stone-400 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-400"
          >
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}

/** Chip de adjunto con botones de editar/quitar en modo edición. */
function AttachmentChip({
  href,
  label,
  editor,
  onEdit,
  onRemove,
}: {
  href: string;
  label: string;
  editor: boolean;
  onEdit?: () => void;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 shadow-sm transition hover:bg-stone-100 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800"
      >
        {label}
      </a>
      {editor && onEdit && (
        <button
          onClick={onEdit}
          aria-label="Editar adjunto"
          className="ml-1 text-xs text-stone-400 hover:text-stone-700"
        >
          ✏️
        </button>
      )}
      {editor && (
        <button
          onClick={onRemove}
          aria-label="Quitar adjunto"
          className="ml-0.5 text-stone-400 hover:text-rose-600"
        >
          ✕
        </button>
      )}
    </span>
  );
}

export function ActivityItem({
  activity,
  color,
  editor,
  last,
}: {
  activity: Activity;
  color: ZoneColor;
  editor: boolean;
  last: boolean;
}) {
  const router = useRouter();
  const c = zoneColor(color);
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [addLink, setAddLink] = useState(false);
  const [editLink, setEditLink] = useState<{ id: string; label: string; url: string } | null>(null);
  const [addPdf, setAddPdf] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [delAtt, setDelAtt] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const longDesc = (activity.descripcion?.length ?? 0) > 110;
  const showDesc = activity.descripcion && (!longDesc || expanded);
  const pdfs = activity.attachments.filter((a) => a.tipo === "pdf");
  const links = activity.attachments.filter((a) => a.tipo === "link");

  async function doDelete() {
    setBusy(true);
    await deleteActivity(activity.id);
    setBusy(false);
    setConfirmDel(false);
    router.refresh();
  }
  async function removeAttachment(id: string) {
    setBusy(true);
    await deleteAttachment(id);
    setBusy(false);
    setDelAtt(null);
    router.refresh();
  }

  return (
    <li className="relative flex gap-3.5">
      {/* Riel del timeline */}
      <div className="flex flex-col items-center">
        <div
          className={
            "grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 bg-white text-lg shadow-sm dark:bg-stone-900 " +
            c.border
          }
        >
          {activity.icono || activityIcon(activity)}
        </div>
        {!last && <div className="my-1 w-0.5 flex-1 rounded-full bg-stone-200 dark:bg-stone-700/70" />}
      </div>

      {/* Contenido */}
      <div className="min-w-0 flex-1 pb-5">
        {activity.hora && (
          <div className={"mb-1 text-xs font-bold uppercase tracking-wide " + c.text}>
            {activity.hora}
          </div>
        )}
        <div className="rounded-2xl border border-stone-300 bg-white p-3.5 shadow transition dark:border-stone-700 dark:bg-stone-900/60">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold leading-snug">{activity.titulo}</h4>
            {editor && (
              <div className="flex shrink-0 gap-1">
                <IconButton title="Editar" onClick={() => setEditing(true)}>
                  ✏️
                </IconButton>
                <IconButton title="Eliminar" variant="danger" onClick={() => setConfirmDel(true)}>
                  🗑️
                </IconButton>
              </div>
            )}
          </div>

          {showDesc && (
            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              {activity.descripcion}
            </p>
          )}
          {longDesc && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className={"mt-1 text-xs font-medium " + c.text}
            >
              {expanded ? "Ver menos" : "Ver más"}
            </button>
          )}

          {/* Sección Documentos (PDFs) */}
          {(pdfs.length > 0 || editor) && (
            <AttachmentSection
              title="📄 Documentos"
              empty="Sin documentos."
              editor={editor}
              onAdd={() => setAddPdf(true)}
              addLabel="+ Subir archivo"
              tint={c.soft}
            >
              {pdfs.map((att) => (
                <AttachmentChip
                  key={att.id}
                  href={pdfUrl(att.storage_path!)}
                  label={att.label}
                  editor={editor}
                  onRemove={() => setDelAtt(att.id)}
                />
              ))}
            </AttachmentSection>
          )}

          {/* Sección Links */}
          {(links.length > 0 || editor) && (
            <AttachmentSection
              title="🔗 Links"
              empty="Sin links."
              editor={editor}
              onAdd={() => setAddLink(true)}
              addLabel="+ Agregar link"
              tint={c.soft}
            >
              {links.map((att) => (
                <AttachmentChip
                  key={att.id}
                  href={att.url!}
                  label={att.label}
                  editor={editor}
                  onEdit={() => setEditLink({ id: att.id, label: att.label, url: att.url! })}
                  onRemove={() => setDelAtt(att.id)}
                />
              ))}
            </AttachmentSection>
          )}
        </div>
      </div>

      {editing && <ActivityModal activity={activity} onClose={() => setEditing(false)} />}
      {addLink && <LinkModal target="activity" id={activity.id} onClose={() => setAddLink(false)} />}
      {editLink && (
        <LinkModal target="activity" id={activity.id} link={editLink} onClose={() => setEditLink(null)} />
      )}
      {addPdf && <PdfModal activityId={activity.id} onClose={() => setAddPdf(false)} />}
      {confirmDel && (
        <ConfirmDialog
          title="Eliminar actividad"
          message={`¿Seguro que querés eliminar "${activity.titulo}"? Se borrarán también sus adjuntos.`}
          onConfirm={doDelete}
          onClose={() => setConfirmDel(false)}
          pending={busy}
        />
      )}
      {delAtt && (
        <ConfirmDialog
          title="Quitar adjunto"
          message="¿Quitar este adjunto?"
          confirmLabel="Quitar"
          onConfirm={() => removeAttachment(delAtt)}
          onClose={() => setDelAtt(null)}
          pending={busy}
        />
      )}
    </li>
  );
}
