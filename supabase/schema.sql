-- ============================================================================
--  Europa 2026 — Esquema de base de datos
--  Ejecutar en Supabase → SQL Editor (una sola vez).
-- ============================================================================

-- Limpieza (por si se reejecuta). Borra TODO. Comentá si no querés resetear.
drop table if exists proposal_links cascade;
drop table if exists proposals cascade;
drop table if exists attachments cascade;
drop table if exists activities cascade;
drop table if exists days cascade;
drop table if exists zones cascade;

-- ----------------------------------------------------------------------------
--  Tablas
-- ----------------------------------------------------------------------------

create table zones (
  id                text primary key default gen_random_uuid()::text,
  nombre            text not null,
  subtitulo         text,
  fecha_desde       date not null,
  fecha_hasta       date not null,
  color             text not null default 'gris',
  orden             int  not null default 0,
  info_alojamiento  text,
  link_alojamiento  text
);

create table days (
  id            text primary key default gen_random_uuid()::text,
  zone_id       text not null references zones(id) on delete cascade,
  fecha         date not null,
  nota_del_dia  text
);
create index on days (zone_id);

create table activities (
  id           text primary key default gen_random_uuid()::text,
  day_id       text not null references days(id) on delete cascade,
  hora         text,
  titulo       text not null,
  descripcion  text,
  icono        text,
  tipo         text not null default 'actividad'
                 check (tipo in ('actividad', 'viaje', 'comida')),
  medio_viaje  text check (medio_viaje in ('avion', 'tren', 'auto')),
  orden        int not null default 0
);
create index on activities (day_id);

create table attachments (
  id            text primary key default gen_random_uuid()::text,
  activity_id   text not null references activities(id) on delete cascade,
  tipo          text not null check (tipo in ('link', 'pdf')),
  label         text not null,
  url           text,
  storage_path  text
);
create index on attachments (activity_id);

create table proposals (
  id      text primary key default gen_random_uuid()::text,
  day_id  text not null references days(id) on delete cascade,
  titulo  text,
  texto   text not null,
  orden   int not null default 0
);
create index on proposals (day_id);

create table proposal_links (
  id           text primary key default gen_random_uuid()::text,
  proposal_id  text not null references proposals(id) on delete cascade,
  label        text not null,
  url          text not null
);
create index on proposal_links (proposal_id);

-- ----------------------------------------------------------------------------
--  Row Level Security
--  Lectura pública para todos. Escritura: NADIE vía la API pública.
--  Todas las mutaciones pasan por el server con la service_role key,
--  que ignora RLS. Así, sin el código de edición no se puede mutar nada
--  aunque se le pegue directo a la API con la anon key.
-- ----------------------------------------------------------------------------

alter table zones           enable row level security;
alter table days            enable row level security;
alter table activities      enable row level security;
alter table attachments     enable row level security;
alter table proposals       enable row level security;
alter table proposal_links  enable row level security;

create policy "lectura publica zones"          on zones          for select using (true);
create policy "lectura publica days"           on days           for select using (true);
create policy "lectura publica activities"     on activities     for select using (true);
create policy "lectura publica attachments"    on attachments    for select using (true);
create policy "lectura publica proposals"      on proposals      for select using (true);
create policy "lectura publica proposal_links" on proposal_links for select using (true);
-- (No hay policies de insert/update/delete → bloqueado para anon y authenticated.)

-- ----------------------------------------------------------------------------
--  Storage: bucket público "tickets" para PDFs (entradas, boletos, reservas)
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('tickets', 'tickets', true)
on conflict (id) do update set public = true;

-- Lectura pública de los archivos del bucket.
drop policy if exists "lectura publica tickets" on storage.objects;
create policy "lectura publica tickets"
  on storage.objects for select
  using (bucket_id = 'tickets');
-- (Las subidas se hacen desde el server con la service_role key.)
