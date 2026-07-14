-- Migración: agrega el campo "icono" (emoji) a las actividades.
-- Ejecutar en Supabase → SQL Editor SOLO si ya creaste las tablas antes
-- de que existiera este campo. (schema.sql ya lo incluye para bases nuevas.)
alter table activities add column if not exists icono text;
