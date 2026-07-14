-- Migración: agrega el campo "titulo" a las propuestas.
-- Ejecutar en Supabase → SQL Editor SOLO si ya creaste las tablas antes
-- de que existiera este campo. (schema.sql ya lo incluye para bases nuevas.)
alter table proposals add column if not exists titulo text;
