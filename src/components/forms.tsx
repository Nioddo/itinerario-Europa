"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Activity, Proposal, Zone } from "@/lib/types";
import {
  Modal,
  Field,
  inputClass,
  PrimaryButton,
  ErrorNote,
} from "./ui";
import {
  createActivity,
  updateActivity,
  createProposal,
  updateProposal,
  addLinkAttachment,
  addProposalLink,
  updateLinkAttachment,
  updateProposalLink,
  uploadPdfAttachment,
  promoteProposal,
  updateZoneAlojamiento,
  updateDayNote,
  type ActionResult,
} from "@/lib/actions";

function useSubmit() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(action: () => Promise<ActionResult>, onDone: () => void) {
    setBusy(true);
    setError(null);
    const res = await action();
    setBusy(false);
    if (res.ok) {
      router.refresh();
      onDone();
    } else {
      setError(res.error);
    }
  }
  return { busy, error, submit };
}

/** Emojis sugeridos para el campo icono de la actividad. */
const EMOJI_SUGGESTIONS = [
  "📍", "✈️", "🚆", "🚗", "🚶", "🍽️", "☕", "🍕", "🍷", "🏛️",
  "🖼️", "⛪", "🏰", "🌳", "🏖️", "🛍️", "🎢", "🎭", "⚽", "🌅",
];

/** Campo de icono: input + fila de emojis sugeridos para elegir con un tap. */
function EmojiField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Field label="Icono (emoji, opcional)">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        placeholder="Elegí uno abajo o escribí un emoji…"
        maxLength={4}
      />
      <div className="mt-1.5 flex flex-wrap gap-1">
        {EMOJI_SUGGESTIONS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => onChange(e)}
            aria-label={`Usar ${e}`}
            className={
              "grid h-9 w-9 place-items-center rounded-lg border text-lg transition hover:bg-stone-100 dark:hover:bg-stone-700 " +
              (value === e
                ? "border-stone-900 bg-stone-100 dark:border-white dark:bg-stone-700"
                : "border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-800")
            }
          >
            {e}
          </button>
        ))}
      </div>
    </Field>
  );
}

/** Normaliza la hora guardada a HH:MM para el selector; si no es parseable, queda vacía. */
function toTimeValue(hora: string | null | undefined): string {
  const m = hora?.match(/^([01]?\d|2[0-3]):([0-5]\d)/);
  return m ? `${m[1].padStart(2, "0")}:${m[2]}` : "";
}

// ------------------------------------------------------------ Campo Horario

const FRANJAS = ["Mañana", "Mediodía", "Tarde", "Noche"];

function parseHora(hora: string | null | undefined): {
  time: string;
  franja: string;
  aprox: boolean;
} {
  if (!hora) return { time: "", franja: "", aprox: false };
  const time = toTimeValue(hora);
  if (time) return { time, franja: "", aprox: /aprox/i.test(hora) };
  const clean = (s: string) => s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const franja = FRANJAS.find((f) => clean(hora).includes(clean(f)));
  return { time: "", franja: franja ?? "", aprox: false };
}

/**
 * Campo de horario: hora exacta (con opción "aprox") o una franja del día.
 * Emite el string final que se guarda: "14:30", "14:30 aprox", "Tarde"…
 */
function HoraField({
  initial,
  onChange,
}: {
  initial?: string | null;
  onChange: (hora: string) => void;
}) {
  const init = parseHora(initial);
  const [time, setTime] = useState(init.time);
  const [franja, setFranja] = useState(init.franja);
  const [aprox, setAprox] = useState(init.aprox);

  function emit(t: string, f: string, a: boolean) {
    onChange(f || (t ? (a ? `${t} aprox` : t) : ""));
  }

  return (
    <Field label="Horario (opcional)">
      <div className="flex items-center gap-3">
        <input
          type="time"
          value={time}
          onChange={(e) => {
            setTime(e.target.value);
            setFranja("");
            emit(e.target.value, "", aprox);
          }}
          className={inputClass + " flex-1"}
        />
        <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-sm text-stone-600 dark:text-stone-400">
          <input
            type="checkbox"
            checked={aprox}
            onChange={(e) => {
              setAprox(e.target.checked);
              emit(time, franja, e.target.checked);
            }}
            className="h-4 w-4 accent-stone-900 dark:accent-white"
          />
          aprox
        </label>
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {FRANJAS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => {
              const next = franja === f ? "" : f;
              setFranja(next);
              setTime("");
              emit("", next, aprox);
            }}
            className={
              "rounded-full border px-3 py-1 text-xs font-medium transition " +
              (franja === f
                ? "border-stone-900 bg-stone-900 text-white dark:border-white dark:bg-white dark:text-stone-900"
                : "border-stone-300 bg-white text-stone-600 hover:border-stone-400 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300")
            }
          >
            {f}
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-stone-400">
        Elegí una hora exacta (podés marcarla como aprox) o una franja del día.
      </p>
    </Field>
  );
}

// ------------------------------------------------------------ Actividad

export function ActivityModal({
  dayId,
  activity,
  onClose,
}: {
  dayId?: string;
  activity?: Activity;
  onClose: () => void;
}) {
  const editing = Boolean(activity);
  const { busy, error, submit } = useSubmit();
  const [hora, setHora] = useState(activity?.hora ?? "");
  const [titulo, setTitulo] = useState(activity?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(activity?.descripcion ?? "");
  const [icono, setIcono] = useState(activity?.icono ?? "");

  function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = { hora, titulo, descripcion, icono };
    submit(
      () =>
        editing
          ? updateActivity({ id: activity!.id, ...payload })
          : createActivity({ dayId: dayId!, ...payload }),
      onClose
    );
  }

  return (
    <Modal title={editing ? "Editar actividad" : "Nueva actividad"} onClose={onClose}>
      <form onSubmit={save}>
        <ErrorNote msg={error} />
        <Field label="Título">
          <input
            autoFocus
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className={inputClass}
            placeholder="¿Qué hacemos?"
          />
        </Field>
        <HoraField initial={activity?.hora} onChange={setHora} />
        <Field label="Descripción (opcional)">
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className={inputClass}
            rows={3}
            placeholder="Detalles, reservas, notas…"
          />
        </Field>
        <EmojiField value={icono} onChange={setIcono} />
        {editing && activity!.attachments.length > 0 && (
          <p className="mb-3 text-xs text-stone-500">
            Los documentos y links se administran desde la tarjeta de la actividad.
          </p>
        )}
        <PrimaryButton type="submit" pending={busy}>
          {editing ? "Guardar cambios" : "Agregar actividad"}
        </PrimaryButton>
      </form>
    </Modal>
  );
}

// ------------------------------------------------------------ Propuesta

export function ProposalModal({
  dayId,
  proposal,
  onClose,
}: {
  dayId?: string;
  proposal?: Proposal;
  onClose: () => void;
}) {
  const editing = Boolean(proposal);
  const { busy, error, submit } = useSubmit();
  // Propuestas viejas sin título: se precarga con el texto para facilitar la migración.
  const [titulo, setTitulo] = useState(proposal?.titulo ?? proposal?.texto ?? "");
  const [texto, setTexto] = useState(proposal?.titulo ? proposal.texto : "");

  function save(e: React.FormEvent) {
    e.preventDefault();
    submit(
      () =>
        editing
          ? updateProposal({ id: proposal!.id, titulo, texto })
          : createProposal({ dayId: dayId!, titulo, texto }),
      onClose
    );
  }

  return (
    <Modal title={editing ? "Editar propuesta" : "Nueva propuesta"} onClose={onClose}>
      <form onSubmit={save}>
        <ErrorNote msg={error} />
        <Field label="Título">
          <input
            autoFocus
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className={inputClass}
            placeholder="Ej: Playa por la tarde"
          />
        </Field>
        <Field label="Detalle (opcional)">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className={inputClass}
            rows={3}
            placeholder="Más info de la idea…"
          />
        </Field>
        <PrimaryButton type="submit" pending={busy}>
          {editing ? "Guardar cambios" : "Agregar propuesta"}
        </PrimaryButton>
      </form>
    </Modal>
  );
}

// ------------------------------------------------------------ Link

export function LinkModal({
  target,
  id,
  link,
  onClose,
}: {
  target: "activity" | "proposal";
  /** Id de la actividad/propuesta (alta) — no se usa al editar. */
  id: string;
  /** Si viene, se edita ese link en vez de crear uno nuevo. */
  link?: { id: string; label: string; url: string };
  onClose: () => void;
}) {
  const editing = Boolean(link);
  const { busy, error, submit } = useSubmit();
  const [label, setLabel] = useState(link?.label ?? "");
  const [url, setUrl] = useState(link?.url ?? "");

  function save(e: React.FormEvent) {
    e.preventDefault();
    submit(() => {
      if (editing) {
        return target === "activity"
          ? updateLinkAttachment({ id: link!.id, label, url })
          : updateProposalLink({ id: link!.id, label, url });
      }
      return target === "activity"
        ? addLinkAttachment({ activityId: id, label, url })
        : addProposalLink({ proposalId: id, label, url });
    }, onClose);
  }

  return (
    <Modal title={editing ? "Editar link" : "Agregar link"} onClose={onClose}>
      <form onSubmit={save}>
        <ErrorNote msg={error} />
        <Field label="Texto del link">
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className={inputClass}
            placeholder="Ej: Reservar entrada"
          />
        </Field>
        <Field label="URL">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={inputClass}
            placeholder="https://…"
            inputMode="url"
          />
        </Field>
        <PrimaryButton type="submit" pending={busy}>
          {editing ? "Guardar cambios" : "Agregar link"}
        </PrimaryButton>
      </form>
    </Modal>
  );
}

// ------------------------------------------------------------ PDF

export function PdfModal({ activityId, onClose }: { activityId: string; onClose: () => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [label, setLabel] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    fd.set("activityId", activityId);
    fd.set("label", label);
    setBusy(true);
    setError(null);
    const res = await uploadPdfAttachment(fd);
    setBusy(false);
    if (res.ok) {
      router.refresh();
      onClose();
    } else {
      setError(res.error);
    }
  }

  return (
    <Modal title="Subir documento" onClose={onClose}>
      <form onSubmit={save}>
        <ErrorNote msg={error} />
        <Field label="Nombre (opcional)">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className={inputClass}
            placeholder="Ej: Entrada Torre Eiffel"
          />
        </Field>
        <Field label="Archivo (PDF, PNG o JPG)">
          <input
            required
            type="file"
            name="file"
            accept="application/pdf,image/png,image/jpeg"
            className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-stone-900 file:px-3 file:py-2 file:text-white dark:file:bg-white dark:file:text-stone-900"
          />
        </Field>
        <p className="mb-3 text-xs text-stone-400">Tamaño máximo ~4 MB.</p>
        <PrimaryButton type="submit" pending={busy}>
          Subir archivo
        </PrimaryButton>
      </form>
    </Modal>
  );
}

// ------------------------------------------------------------ Nota del día

export function DayNoteModal({
  dayId,
  nota,
  onClose,
}: {
  dayId: string;
  nota: string | null;
  onClose: () => void;
}) {
  const { busy, error, submit } = useSubmit();
  const [texto, setTexto] = useState(nota ?? "");

  function save(e: React.FormEvent) {
    e.preventDefault();
    submit(() => updateDayNote({ dayId, nota: texto }), onClose);
  }

  return (
    <Modal title="Nota del día" onClose={onClose}>
      <form onSubmit={save}>
        <ErrorNote msg={error} />
        <Field label="Nota">
          <textarea
            autoFocus
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className={inputClass}
            rows={4}
            placeholder="Ej: Ruta desde Edimburgo, llevar abrigo, paradas…"
          />
        </Field>
        <p className="mb-3 text-xs text-stone-500">Dejala vacía para quitar la nota del día.</p>
        <PrimaryButton type="submit" pending={busy}>
          Guardar nota
        </PrimaryButton>
      </form>
    </Modal>
  );
}

// ------------------------------------------------------------ Alojamiento

export function AlojamientoModal({ zone, onClose }: { zone: Zone; onClose: () => void }) {
  const { busy, error, submit } = useSubmit();
  const [info, setInfo] = useState(zone.info_alojamiento ?? "");
  const [link, setLink] = useState(zone.link_alojamiento ?? "");

  function save(e: React.FormEvent) {
    e.preventDefault();
    submit(
      () => updateZoneAlojamiento({ id: zone.id, infoAlojamiento: info, linkAlojamiento: link }),
      onClose
    );
  }

  return (
    <Modal title={`Alojamiento · ${zone.nombre}`} onClose={onClose}>
      <form onSubmit={save}>
        <ErrorNote msg={error} />
        <Field label="Info del alojamiento">
          <textarea
            autoFocus
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            className={inputClass}
            rows={4}
            placeholder="Nombre, dirección, check-in, notas…"
          />
        </Field>
        <Field label="Link (Airbnb, Booking, Maps…) — opcional">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className={inputClass}
            placeholder="https://…"
            inputMode="url"
          />
        </Field>
        <PrimaryButton type="submit" pending={busy}>
          Guardar alojamiento
        </PrimaryButton>
      </form>
    </Modal>
  );
}

// ------------------------------------------------------------ Promover

export function PromoteModal({
  proposalId,
  texto,
  onClose,
}: {
  proposalId: string;
  /** Texto de la propuesta: título inicial de la actividad. */
  texto: string;
  onClose: () => void;
}) {
  const { busy, error, submit } = useSubmit();
  const [titulo, setTitulo] = useState(texto);
  const [hora, setHora] = useState("");
  const [icono, setIcono] = useState("");

  function save(e: React.FormEvent) {
    e.preventDefault();
    submit(() => promoteProposal({ proposalId, titulo, hora, icono }), onClose);
  }

  return (
    <Modal title="Promover a actividad" onClose={onClose}>
      <form onSubmit={save}>
        <ErrorNote msg={error} />
        <p className="mb-3 text-sm text-stone-600">
          La propuesta pasa a ser una actividad del día. Sus links se conservan como adjuntos.
        </p>
        <Field label="Título">
          <input
            autoFocus
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className={inputClass}
            placeholder="¿Qué hacemos?"
          />
        </Field>
        <HoraField onChange={setHora} />
        <EmojiField value={icono} onChange={setIcono} />
        <PrimaryButton type="submit" pending={busy}>
          Promover a actividad
        </PrimaryButton>
      </form>
    </Modal>
  );
}
