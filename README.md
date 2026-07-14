# Europa 2026 · Itinerario

Web app del itinerario del viaje familiar por Europa (14/7/2026 → 7/8/2026).
Estilo calendario día por día, agrupado por zonas. Cualquiera con el link ve todo;
para editar hay un candado 🔒 con código.

- **Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Supabase (Postgres + Storage para PDFs)
- **Deploy:** Vercel

La app funciona **sin Supabase en modo demo** (datos de ejemplo, no se guardan cambios),
así podés previsualizarla antes de configurar nada.

---

## 1. Correr en local (opcional)

```bash
npm install
cp .env.local.example .env.local   # editá los valores (o dejá solo EDIT_CODE para modo demo)
npm run dev                          # http://localhost:3000
```

Sin las variables de Supabase, arranca en **modo demo**. Con `EDIT_CODE` seteado ya
podés probar el flujo de desbloqueo.

---

## 2. Crear el proyecto en Supabase

1. Entrá a [supabase.com](https://supabase.com) → **New project**. Elegí nombre y contraseña de la DB.
2. Cuando esté listo, andá a **Project Settings → API** y anotá:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (¡secreta!) → `SUPABASE_SERVICE_ROLE_KEY`

## 3. Crear las tablas y cargar los datos

En el panel de Supabase → **SQL Editor**:

1. Abrí **New query**, pegá **todo** el contenido de [`supabase/schema.sql`](supabase/schema.sql)
   y ejecutá (**Run**). Esto crea las tablas, las policies de RLS y el bucket `tickets`.
2. Abrí otra query, pegá **todo** el contenido de [`supabase/seed.sql`](supabase/seed.sql)
   y ejecutá. Esto carga todo el itinerario.

> `seed.sql` se genera automáticamente desde `supabase/itinerary.json` con
> `npm run gen:seed`. Si querés cambiar los datos iniciales, editá el JSON y regeneralo.

Verificá en **Table Editor** que las tablas `zones`, `days`, `activities`, etc. tengan datos,
y en **Storage** que exista el bucket **tickets** (público).

## 4. Variables de entorno

Para local, en `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
EDIT_CODE=elegí-un-código-secreto
```

- `EDIT_CODE` es el código que habilita el modo edición. Elegí uno propio.

## 5. Deploy en Vercel

1. Subí el repo a GitHub.
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importá el repo. Framework: **Next.js** (autodetectado).
3. En **Environment Variables** cargá las **cuatro** variables del paso anterior
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `EDIT_CODE`).
4. **Deploy**. Listo: compartí la URL con la familia.

> Si cambiás alguna env var después, redeployá para que tome efecto.

---

## Cómo funciona la edición (seguridad)

- El botón 🔒 abre un modal donde se ingresa el código. Se valida **en el servidor**
  (`POST /api/auth`) contra `EDIT_CODE`.
- Si es correcto, se setea una cookie **httpOnly firmada (HMAC)** con vencimiento de 30 días.
  La cookie no es legible ni falsificable desde el navegador.
- **Todas** las mutaciones (crear/editar/borrar/subir) son Server Actions que llaman a
  `requireEditor()` antes de tocar nada. Sin cookie válida → `No autorizado`.
- La base tiene **RLS**: sólo lectura pública. No hay policies de escritura para la
  `anon key`, así que aunque alguien le pegue directo a la API de Supabase con la clave
  pública, **no puede escribir**. Las escrituras usan la `service_role` sólo del lado del
  servidor, después de validar la cookie.

### Verificar que sin código no se puede mutar (contra tu Supabase real)

```bash
# Con la anon key (la pública), intentá insertar → debe fallar por RLS:
curl -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/proposals" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"day_id":"z1-d4","texto":"hack","orden":99}'
# → respuesta con error de RLS (row-level security), no se inserta.
```

---

## Modelo de datos

`zones` → `days` → (`activities` → `attachments`) y (`proposals` → `proposal_links`).

| Tabla | Campos clave |
|---|---|
| `zones` | nombre, subtitulo, fecha_desde/hasta, color, orden, info_alojamiento, link_alojamiento |
| `days` | zone_id, fecha, nota_del_dia |
| `activities` | day_id, hora, titulo, descripcion, tipo (`actividad`/`viaje`/`comida`), medio_viaje (`avion`/`tren`/`auto`), orden |
| `attachments` | activity_id, tipo (`link`/`pdf`), label, url, storage_path |
| `proposals` | day_id, texto, orden |
| `proposal_links` | proposal_id, label, url |

Los PDFs se suben desde el modo edición al bucket público `tickets` y se abren en pestaña nueva.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build |
| `npm run gen:seed` | Regenera `supabase/seed.sql` desde `supabase/itinerary.json` |
