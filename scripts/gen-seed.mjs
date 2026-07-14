// Genera supabase/seed.sql a partir de supabase/itinerary.json (fuente única de verdad).
// Uso: npm run gen:seed
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const data = JSON.parse(readFileSync(join(root, "supabase", "itinerary.json"), "utf8"));

const q = (v) => (v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`);

const lines = [];
lines.push("-- ============================================================================");
lines.push("--  Europa 2026 — Seed de datos");
lines.push("--  GENERADO AUTOMÁTICAMENTE por scripts/gen-seed.mjs — no editar a mano.");
lines.push("--  Ejecutar en Supabase → SQL Editor DESPUÉS de schema.sql.");
lines.push("-- ============================================================================");
lines.push("");
lines.push("-- Limpieza de datos previos (mantiene el esquema).");
lines.push("truncate table proposal_links, proposals, attachments, activities, days, zones restart identity cascade;");
lines.push("");

const zoneRows = [];
const dayRows = [];
const actRows = [];
const attRows = [];
const propRows = [];
const linkRows = [];

for (const z of data.zones) {
  zoneRows.push(
    `(${q(z.id)}, ${q(z.nombre)}, ${q(z.subtitulo)}, ${q(z.fecha_desde)}, ${q(z.fecha_hasta)}, ${q(z.color)}, ${z.orden}, ${q(z.info_alojamiento)}, ${q(z.link_alojamiento)})`
  );
  for (const d of z.days) {
    dayRows.push(`(${q(d.id)}, ${q(z.id)}, ${q(d.fecha)}, ${q(d.nota_del_dia)})`);
    for (const a of d.activities) {
      actRows.push(
        `(${q(a.id)}, ${q(d.id)}, ${q(a.hora)}, ${q(a.titulo)}, ${q(a.descripcion)}, ${q(a.icono ?? null)}, ${q(a.tipo)}, ${q(a.medio_viaje)}, ${a.orden})`
      );
      for (const at of a.attachments || []) {
        attRows.push(
          `(${q(at.id)}, ${q(a.id)}, ${q(at.tipo)}, ${q(at.label)}, ${q(at.url)}, ${q(at.storage_path)})`
        );
      }
    }
    for (const p of d.proposals) {
      propRows.push(`(${q(p.id)}, ${q(d.id)}, ${q(p.titulo ?? null)}, ${q(p.texto)}, ${p.orden})`);
      for (const l of p.links || []) {
        linkRows.push(`(${q(l.id)}, ${q(p.id)}, ${q(l.label)}, ${q(l.url)})`);
      }
    }
  }
}

const block = (title, cols, table, rows) => {
  lines.push(`-- ${title}`);
  lines.push(`insert into ${table} (${cols}) values`);
  lines.push(rows.join(",\n") + ";");
  lines.push("");
};

block("Zonas", "id, nombre, subtitulo, fecha_desde, fecha_hasta, color, orden, info_alojamiento, link_alojamiento", "zones", zoneRows);
block("Días", "id, zone_id, fecha, nota_del_dia", "days", dayRows);
block("Actividades", "id, day_id, hora, titulo, descripcion, icono, tipo, medio_viaje, orden", "activities", actRows);
if (attRows.length) block("Adjuntos", "id, activity_id, tipo, label, url, storage_path", "attachments", attRows);
block("Propuestas", "id, day_id, titulo, texto, orden", "proposals", propRows);
if (linkRows.length) block("Links de propuestas", "id, proposal_id, label, url", "proposal_links", linkRows);

writeFileSync(join(root, "supabase", "seed.sql"), lines.join("\n"), "utf8");
console.log(
  `seed.sql generado: ${zoneRows.length} zonas, ${dayRows.length} días, ${actRows.length} actividades, ${attRows.length} adjuntos, ${propRows.length} propuestas, ${linkRows.length} links.`
);
