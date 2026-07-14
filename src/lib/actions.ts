"use server";

import { revalidatePath } from "next/cache";
import { requireEditor } from "./auth";
import { getAdminClient, TICKETS_BUCKET } from "./supabase";
import { isSupabaseConfigured } from "./supabase";

export type ActionResult = { ok: true } | { ok: false; error: string };

async function run(fn: () => Promise<void>): Promise<ActionResult> {
  try {
    requireEditor();
    if (!isSupabaseConfigured()) {
      return { ok: false, error: "Modo demo: configurá Supabase para poder editar." };
    }
    await fn();
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error inesperado." };
  }
}

async function nextOrden(table: string, column: string, id: string): Promise<number> {
  const sb = getAdminClient();
  const { data } = await sb.from(table).select("orden").eq(column, id).order("orden", { ascending: false }).limit(1);
  return (data?.[0]?.orden ?? 0) + 1;
}

// --------------------------------------------------------------------- Zonas

export async function updateZoneAlojamiento(input: {
  id: string;
  infoAlojamiento: string;
  linkAlojamiento: string;
}): Promise<ActionResult> {
  return run(async () => {
    const sb = getAdminClient();
    const { error } = await sb
      .from("zones")
      .update({
        info_alojamiento: input.infoAlojamiento.trim() || null,
        link_alojamiento: input.linkAlojamiento.trim() || null,
      })
      .eq("id", input.id);
    if (error) throw new Error(error.message);
  });
}

// ----------------------------------------------------------------------- Días

export async function updateDayNote(input: { dayId: string; nota: string }): Promise<ActionResult> {
  return run(async () => {
    const sb = getAdminClient();
    const { error } = await sb
      .from("days")
      .update({ nota_del_dia: input.nota.trim() || null })
      .eq("id", input.dayId);
    if (error) throw new Error(error.message);
  });
}

// ---------------------------------------------------------------- Actividades

export async function createActivity(input: {
  dayId: string;
  hora: string;
  titulo: string;
  descripcion: string;
  icono: string;
}): Promise<ActionResult> {
  return run(async () => {
    if (!input.titulo.trim()) throw new Error("El título es obligatorio.");
    const sb = getAdminClient();
    const orden = await nextOrden("activities", "day_id", input.dayId);
    const { error } = await sb.from("activities").insert({
      day_id: input.dayId,
      hora: input.hora.trim() || null,
      titulo: input.titulo.trim(),
      descripcion: input.descripcion.trim() || null,
      icono: input.icono.trim() || null,
      orden,
    });
    if (error) throw new Error(error.message);
  });
}

export async function updateActivity(input: {
  id: string;
  hora: string;
  titulo: string;
  descripcion: string;
  icono: string;
}): Promise<ActionResult> {
  return run(async () => {
    if (!input.titulo.trim()) throw new Error("El título es obligatorio.");
    const sb = getAdminClient();
    // tipo y medio_viaje ya no se editan desde el formulario; se conservan como están.
    const { error } = await sb
      .from("activities")
      .update({
        hora: input.hora.trim() || null,
        titulo: input.titulo.trim(),
        descripcion: input.descripcion.trim() || null,
        icono: input.icono.trim() || null,
      })
      .eq("id", input.id);
    if (error) throw new Error(error.message);
  });
}

export async function deleteActivity(id: string): Promise<ActionResult> {
  return run(async () => {
    const sb = getAdminClient();
    // Borrar PDFs asociados del storage.
    const { data: atts } = await sb.from("attachments").select("storage_path").eq("activity_id", id);
    const paths = (atts ?? []).map((a: any) => a.storage_path).filter(Boolean) as string[];
    if (paths.length) await sb.storage.from(TICKETS_BUCKET).remove(paths);
    const { error } = await sb.from("activities").delete().eq("id", id);
    if (error) throw new Error(error.message);
  });
}

// ------------------------------------------------------------------ Adjuntos

export async function addLinkAttachment(input: {
  activityId: string;
  label: string;
  url: string;
}): Promise<ActionResult> {
  return run(async () => {
    if (!input.label.trim() || !input.url.trim()) throw new Error("Faltan datos del link.");
    const sb = getAdminClient();
    const { error } = await sb.from("attachments").insert({
      activity_id: input.activityId,
      tipo: "link",
      label: input.label.trim(),
      url: input.url.trim(),
    });
    if (error) throw new Error(error.message);
  });
}

/** Tipos de archivo permitidos como adjunto (documentos e imágenes). */
const ALLOWED_FILE_TYPES = new Set(["application/pdf", "image/png", "image/jpeg"]);

export async function uploadPdfAttachment(formData: FormData): Promise<ActionResult> {
  return run(async () => {
    const activityId = String(formData.get("activityId") ?? "");
    const label = String(formData.get("label") ?? "").trim();
    const file = formData.get("file");
    if (!activityId) throw new Error("Falta la actividad.");
    if (!(file instanceof File) || file.size === 0) throw new Error("Elegí un archivo.");
    if (!ALLOWED_FILE_TYPES.has(file.type))
      throw new Error("El archivo debe ser PDF, PNG o JPG.");
    if (file.size > 10 * 1024 * 1024) throw new Error("El archivo supera los 10 MB.");

    const sb = getAdminClient();
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${activityId}/${crypto.randomUUID()}-${safe}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await sb.storage
      .from(TICKETS_BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false });
    if (upErr) throw new Error(upErr.message);

    const { error } = await sb.from("attachments").insert({
      activity_id: activityId,
      tipo: "pdf",
      label: label || file.name.replace(/\.(pdf|png|jpe?g)$/i, ""),
      storage_path: path,
    });
    if (error) throw new Error(error.message);
  });
}

export async function updateLinkAttachment(input: {
  id: string;
  label: string;
  url: string;
}): Promise<ActionResult> {
  return run(async () => {
    if (!input.label.trim() || !input.url.trim()) throw new Error("Faltan datos del link.");
    const sb = getAdminClient();
    const { error } = await sb
      .from("attachments")
      .update({ label: input.label.trim(), url: input.url.trim() })
      .eq("id", input.id)
      .eq("tipo", "link");
    if (error) throw new Error(error.message);
  });
}

export async function deleteAttachment(id: string): Promise<ActionResult> {
  return run(async () => {
    const sb = getAdminClient();
    const { data } = await sb.from("attachments").select("storage_path").eq("id", id).single();
    if (data?.storage_path) await sb.storage.from(TICKETS_BUCKET).remove([data.storage_path]);
    const { error } = await sb.from("attachments").delete().eq("id", id);
    if (error) throw new Error(error.message);
  });
}

// ----------------------------------------------------------------- Propuestas

export async function createProposal(input: {
  dayId: string;
  titulo: string;
  texto: string;
}): Promise<ActionResult> {
  return run(async () => {
    if (!input.titulo.trim()) throw new Error("El título es obligatorio.");
    const sb = getAdminClient();
    const orden = await nextOrden("proposals", "day_id", input.dayId);
    const { error } = await sb.from("proposals").insert({
      day_id: input.dayId,
      titulo: input.titulo.trim(),
      texto: input.texto.trim() || "",
      orden,
    });
    if (error) throw new Error(error.message);
  });
}

export async function updateProposal(input: {
  id: string;
  titulo: string;
  texto: string;
}): Promise<ActionResult> {
  return run(async () => {
    if (!input.titulo.trim()) throw new Error("El título es obligatorio.");
    const sb = getAdminClient();
    const { error } = await sb
      .from("proposals")
      .update({ titulo: input.titulo.trim(), texto: input.texto.trim() || "" })
      .eq("id", input.id);
    if (error) throw new Error(error.message);
  });
}

export async function deleteProposal(id: string): Promise<ActionResult> {
  return run(async () => {
    const sb = getAdminClient();
    const { error } = await sb.from("proposals").delete().eq("id", id);
    if (error) throw new Error(error.message);
  });
}

export async function addProposalLink(input: {
  proposalId: string;
  label: string;
  url: string;
}): Promise<ActionResult> {
  return run(async () => {
    if (!input.label.trim() || !input.url.trim()) throw new Error("Faltan datos del link.");
    const sb = getAdminClient();
    const { error } = await sb.from("proposal_links").insert({
      proposal_id: input.proposalId,
      label: input.label.trim(),
      url: input.url.trim(),
    });
    if (error) throw new Error(error.message);
  });
}

export async function updateProposalLink(input: {
  id: string;
  label: string;
  url: string;
}): Promise<ActionResult> {
  return run(async () => {
    if (!input.label.trim() || !input.url.trim()) throw new Error("Faltan datos del link.");
    const sb = getAdminClient();
    const { error } = await sb
      .from("proposal_links")
      .update({ label: input.label.trim(), url: input.url.trim() })
      .eq("id", input.id);
    if (error) throw new Error(error.message);
  });
}

export async function deleteProposalLink(id: string): Promise<ActionResult> {
  return run(async () => {
    const sb = getAdminClient();
    const { error } = await sb.from("proposal_links").delete().eq("id", id);
    if (error) throw new Error(error.message);
  });
}

/** Convierte una propuesta en actividad, arrastrando sus links como adjuntos. */
export async function promoteProposal(input: {
  proposalId: string;
  titulo: string;
  hora: string;
  icono: string;
}): Promise<ActionResult> {
  return run(async () => {
    const sb = getAdminClient();
    const { data: prop, error: pErr } = await sb
      .from("proposals")
      .select("id, day_id, titulo, texto")
      .eq("id", input.proposalId)
      .single();
    if (pErr || !prop) throw new Error("No se encontró la propuesta.");

    const orden = await nextOrden("activities", "day_id", prop.day_id);
    const { data: act, error: aErr } = await sb
      .from("activities")
      .insert({
        day_id: prop.day_id,
        hora: input.hora.trim() || null,
        titulo: input.titulo.trim() || prop.titulo || prop.texto,
        descripcion: prop.titulo ? prop.texto || null : null,
        icono: input.icono.trim() || null,
        orden,
      })
      .select("id")
      .single();
    if (aErr || !act) throw new Error(aErr?.message ?? "No se pudo crear la actividad.");

    const { data: links } = await sb.from("proposal_links").select("label, url").eq("proposal_id", prop.id);
    if (links && links.length) {
      await sb.from("attachments").insert(
        links.map((l: any) => ({ activity_id: act.id, tipo: "link", label: l.label, url: l.url }))
      );
    }

    const { error: dErr } = await sb.from("proposals").delete().eq("id", prop.id);
    if (dErr) throw new Error(dErr.message);
  });
}
