-- ============================================================================
--  Europa 2026 — Seed de datos
--  GENERADO AUTOMÁTICAMENTE por scripts/gen-seed.mjs — no editar a mano.
--  Ejecutar en Supabase → SQL Editor DESPUÉS de schema.sql.
-- ============================================================================

-- Limpieza de datos previos (mantiene el esquema).
truncate table proposal_links, proposals, attachments, activities, days, zones restart identity cascade;

-- Zonas
insert into zones (id, nombre, subtitulo, fecha_desde, fecha_hasta, color, orden, info_alojamiento, link_alojamiento) values
('z1', 'Ida + Galicia', 'Isla de Arousa', '2026-07-14', '2026-07-19', 'verde', 1, 'Isla de Arousa · 5 noches (15–20/7) · 155 €/noche · pago en efectivo', null),
('z2', 'Londres', 'Inglaterra', '2026-07-20', '2026-07-23', 'rojo', 2, 'Bell Street, Londres NW1 · 1 cama doble, 1 simple, 1 sofá cama · 4 noches (20–23/7)', 'https://www.google.com/maps/place//@51.521025,-0.16979,17z'),
('z3', 'Edimburgo', 'Escocia', '2026-07-24', '2026-07-25', 'azul', 3, '1 Fleshmarket Cl, Edinburgh EH1 1PB · 1 cama doble + sofá cama · noches 24 y 25/7', null),
('z4', 'Highlands', 'En auto', '2026-07-26', '2026-07-27', 'violeta', 4, '26/7: 63 Argyle St, Inverness IV2 3BD (1 doble + 2 chicas) · 27/7: Hilton Edinburgh Airport (dormimos cerca del aeropuerto porque el vuelo del 28 sale 5:40)', null),
('z5', 'París', 'Francia', '2026-07-28', '2026-07-30', 'dorado', 5, '20 Rue Duhesme, París 75018 (Montmartre, metro Lamarck-Caulaincourt) · 1 doble + 2 chicas · noches 28–30/7', null),
('z6', 'Barcelona', 'España', '2026-07-31', '2026-08-05', 'naranja', 6, 'Barcelona · 6 noches (31/7 al 5/8) · 190 €/noche efectivo (Maru) · 1 doble + 2 chicas', null),
('z7', 'Madrid + vuelta', 'Regreso a Argentina', '2026-08-06', '2026-08-07', 'gris', 7, null, null);

-- Días
insert into days (id, zone_id, fecha, nota_del_dia) values
('z1-d1', 'z1', '2026-07-14', null),
('z1-d2', 'z1', '2026-07-15', null),
('z1-d3', 'z1', '2026-07-16', null),
('z1-d4', 'z1', '2026-07-17', null),
('z1-d5', 'z1', '2026-07-18', 'Fiesta de la Virgen del Carmen, todo el día en la isla.'),
('z1-d6', 'z1', '2026-07-19', null),
('z2-d1', 'z2', '2026-07-20', null),
('z2-d2', 'z2', '2026-07-21', null),
('z2-d3', 'z2', '2026-07-22', 'Nada fijo por ahora.'),
('z2-d4', 'z2', '2026-07-23', null),
('z3-d1', 'z3', '2026-07-24', null),
('z3-d2', 'z3', '2026-07-25', null),
('z4-d1', 'z4', '2026-07-26', 'Ruta Edimburgo → Balmoral → Inverness (~260 km, 4:45 hs de manejo).'),
('z4-d2', 'z4', '2026-07-27', 'Ruta Inverness → Loch Ness → Fort William → Glencoe → Edimburgo (~290 km, 5:30–6 hs).'),
('z5-d1', 'z5', '2026-07-28', null),
('z5-d2', 'z5', '2026-07-29', null),
('z5-d3', 'z5', '2026-07-30', null),
('z6-d1', 'z6', '2026-07-31', null),
('z6-d2', 'z6', '2026-08-01', null),
('z6-d3', 'z6', '2026-08-02', null),
('z6-d4', 'z6', '2026-08-03', null),
('z6-d5', 'z6', '2026-08-04', null),
('z6-d6', 'z6', '2026-08-05', null),
('z7-d1', 'z7', '2026-08-06', null),
('z7-d2', 'z7', '2026-08-07', null);

-- Actividades
insert into activities (id, day_id, hora, titulo, descripcion, icono, tipo, medio_viaje, orden) values
('z1-d1-a1', 'z1-d1', 'Noche', 'Vuelo Buenos Aires → Madrid', 'IB0108 · Reservas HW5M9 / HW5L5. Salida por la noche.', null, 'viaje', 'avion', 1),
('z1-d2-a1', 'z1-d2', null, 'Vuelo Madrid → Santiago de Compostela', 'IB1137 · Reservas J4RPH / J4S4X. Llegada 21:00.', null, 'viaje', 'avion', 1),
('z1-d2-a2', 'z1-d2', '22:00 aprox', 'Auto Santiago → Isla de Arousa', 'Llegada 00:00.', null, 'viaje', 'auto', 2),
('z1-d3-a1', 'z1-d3', null, 'Día en la Isla de Arousa', 'Visitar la isla, familia, etc.', null, 'actividad', null, 1),
('z1-d5-a1', 'z1-d5', 'Mediodía', 'Comemos en lo de Ana', null, null, 'comida', null, 1),
('z1-d5-a2', 'z1-d5', 'Noche', 'Cena afuera', 'Lugar a definir.', null, 'comida', null, 2),
('z1-d6-a1', 'z1-d6', '21:00', 'Final del Mundial 🏆', null, null, 'actividad', null, 1),
('z2-d1-a1', 'z2-d1', '07:00', 'Vuelo Santiago → Londres', 'VY6226 · Reserva SHD9JS. Llegada 10:00. Después hotel; con suerte al mediodía nos liberamos.', null, 'viaje', 'avion', 1),
('z2-d2-a1', 'z2-d2', '11:00', 'Tour de los Beatles', '3 hs, termina en Abbey Road, cerca de Camden Town.', null, 'actividad', null, 1),
('z2-d4-a1', 'z2-d4', '13:30', 'Comida en St John''s', 'Cerca de St Paul''s Cathedral.', null, 'comida', null, 1),
('z3-d1-a1', 'z3-d1', '08:00', 'Tren LNER Londres King''s Cross → Edimburgo', 'Reserva 26SXIVLPZB. Llegada al mediodía.', null, 'viaje', 'tren', 1),
('z3-d1-a2', 'z3-d1', '17:00', 'Free tour de Edimburgo', null, null, 'actividad', null, 2),
('z3-d2-a1', 'z3-d2', 'Tarde', 'Recorrido Harry Potter', 'Victoria Street, Greyfriars, etc.', null, 'actividad', null, 1),
('z3-d2-a2', 'z3-d2', '20:30', 'Free tour de fantasmas', null, null, 'actividad', null, 2),
('z4-d1-a1', 'z4-d1', '07:30', 'Retiramos el auto y salimos de Edimburgo', null, null, 'viaje', 'auto', 1),
('z4-d1-a2', 'z4-d1', '08:45 aprox', 'Parada en Perth', 'Café rápido, 20–30 min.', null, 'actividad', null, 2),
('z4-d1-a3', 'z4-d1', 'Mañana', 'Cruce del Parque Nacional Cairngorms (A93)', 'Parada en el mirador The Devil''s Elbow (10 min); parada en Braemar.', null, 'actividad', null, 3),
('z4-d1-a4', 'z4-d1', '11:30', 'Balmoral Castle', 'Residencia de verano de la familia real (1–1.5 hs): jardines, salón de baile, senderos.', null, 'actividad', null, 4),
('z4-d1-a5', 'z4-d1', 'Tarde', 'Balmoral → Inverness', 'Por Braemar y Lecht Pass. Llegada 17:30–18:30.', null, 'viaje', 'auto', 5),
('z4-d1-a6', 'z4-d1', 'Tarde', 'Paseo por Inverness', 'Castillo y río Ness. Dormimos en Inverness.', null, 'actividad', null, 6),
('z4-d2-a1', 'z4-d2', '08:30', 'Salida por la orilla oeste del Lago Ness', null, null, 'viaje', 'auto', 1),
('z4-d2-a2', 'z4-d2', 'Mañana', 'Urquhart Castle', 'Ruinas frente al lago (45–60 min).', null, 'actividad', null, 2),
('z4-d2-a3', 'z4-d2', 'Mediodía', 'Fort William', 'Almuerzo rápido, vistas al Ben Nevis.', null, 'actividad', null, 3),
('z4-d2-a4', 'z4-d2', 'Tarde', 'Glencoe', 'Lo más espectacular del viaje: Three Sisters, Visitor Centre (1–1.5 hs).', null, 'actividad', null, 4),
('z4-d2-a5', 'z4-d2', null, 'Regreso a Edimburgo', 'Por Rannoch Moor y Callander. Llegada 19:30–20:00. Dormimos en el Hilton del aeropuerto.', null, 'viaje', 'auto', 5),
('z5-d1-a1', 'z5-d1', '05:40', 'Vuelo Edimburgo → París CDG', 'AF1887 · Reserva YW66QI. Llegada 09:00.', null, 'viaje', 'avion', 1),
('z5-d2-a1', 'z5-d2', '11:00', 'Tour de la Segunda Guerra Mundial', null, null, 'actividad', null, 1),
('z5-d2-a2', 'z5-d2', '21:00', 'Ascenso a la Torre Eiffel', 'Cima en ascensor: 36,70 € adulto / 18,40 € joven (12-24). Entrada ya comprada (134 USD).', null, 'actividad', null, 2),
('z5-d3-a1', 'z5-d3', '10:00', 'Museo del Louvre', '2-3 hs. Ver las obras clave antes de ir.', null, 'actividad', null, 1),
('z6-d1-a1', 'z6-d1', '14:40', 'Tren TGV París → Barcelona', 'Llegada 21:00.', null, 'viaje', 'tren', 1),
('z6-d2-a1', 'z6-d2', null, 'Día con los tíos abuelos y Guillem', 'Probablemente playa.', null, 'actividad', null, 1),
('z6-d3-a1', 'z6-d3', null, 'Día en familia / playa', 'Ídem día anterior.', null, 'actividad', null, 1),
('z6-d4-a1', 'z6-d4', '16:30', 'Sagrada Familia', 'Entrada comprada (186,86 USD).', null, 'actividad', null, 1),
('z6-d5-a1', 'z6-d5', '09:30', 'Park Güell', 'Entrada comprada (84,29 USD).', null, 'actividad', null, 1),
('z7-d1-a1', 'z7-d1', null, 'Tren Barcelona → Madrid', 'x3, ~71 USD c/u.', null, 'viaje', 'tren', 1),
('z7-d2-a1', 'z7-d2', null, 'Vuelo Madrid → Buenos Aires', 'Llegada a Argentina.', null, 'viaje', 'avion', 1);

-- Adjuntos
insert into attachments (id, activity_id, tipo, label, url, storage_path) values
('z2-d2-a1-l1', 'z2-d2-a1', 'link', 'Reservar tour Beatles', 'https://www.civitatis.com/ar/londres/tour-beatles-londres/', null),
('z3-d1-a2-l1', 'z3-d1-a2', 'link', 'Free tour Edimburgo', 'https://www.civitatis.com/ar/edimburgo/free-tour-edimburgo/', null),
('z3-d2-a2-l1', 'z3-d2-a2', 'link', 'Free tour fantasmas', 'https://www.civitatis.com/ar/edimburgo/free-tour-fantasmas-edimburgo/', null),
('z5-d3-a1-l1', 'z5-d3-a1', 'link', 'Obras que ver en el Louvre', 'https://www.viajeroscallejeros.com/obras-que-ver-en-el-louvre/', null);

-- Propuestas
insert into proposals (id, day_id, titulo, texto, orden) values
('z1-d4-p1', 'z1-d4', null, 'Ir a A Coruña', 1),
('z1-d4-p2', 'z1-d4', null, 'Ir a Santiago de Compostela a visitar la Catedral', 2),
('z1-d6-p1', 'z1-d6', null, 'Buscar qué hacer durante el día', 1),
('z1-d6-p2', 'z1-d6', null, 'Visitar playas', 2),
('z1-d6-p3', 'z1-d6', null, 'Vigo', 3),
('z1-d6-p4', 'z1-d6', null, 'Pontevedra', 4),
('z2-d1-p1', 'z2-d1', null, 'Free walking tour a la tarde — empieza en Trafalgar Square: Westminster, Big Ben, Buckingham Palace, National Gallery, St James''s Park.', 1),
('z2-d2-p1', 'z2-d2', null, 'Ir a Camden Town después del tour.', 1),
('z2-d2-p2', 'z2-d2', null, 'Museo Británico.', 2),
('z2-d2-p3', 'z2-d2', null, 'Recorrido Día 3: Little Venice → Camden Town (Stables Market, Camden High St) → Primrose Hill → Museo Británico → Torre de Londres (£37 adulto, cierra 17:30) → Tower Bridge (mirador Potters Fields Park) → The Shard al atardecer.', 3),
('z2-d2-p4', 'z2-d2', null, 'Covent Garden abre 10–20 (Apple Market hasta las 18).', 4),
('z2-d3-p1', 'z2-d3', null, 'Recorrido Día 2: Notting Hill y mercado de Portobello (todos los días menos domingo) → Hyde Park (cambio de guardia en Buckingham 11:00, llegar antes de las 10) → Museo de Historia Natural (gratis) → Royal Albert Hall → Covent Garden → Trafalgar Square → Piccadilly Circus → Regent Street → Soho.', 1),
('z2-d4-p1', 'z2-d4', null, 'Recorrido Día 1: St James''s Park → Palacio de Buckingham → Abadía de Westminster (£125 los 4) → Big Ben + Puente de Westminster → London Eye (£29 estándar / £44 fast track; combo con river cruise £50) → Leake Street Tunnel → Millennium Bridge → Catedral de San Pablo → St Dunstan in the East → Leadenhall Market (Harry Potter) → Sky Garden gratis a última hora (alternativas: The Garden at 120, Horizon 22).', 1),
('z3-d1-p1', 'z3-d1', null, 'Averiguar Royal Edinburgh Ticket (Castillo + Yate Britannia + Holyrood + bus).', 1),
('z3-d2-p1', 'z3-d2', null, 'Recorrido Día 1: Castillo de Edimburgo (abre 9:30, ~2 hs, cañón de la una) → Royal Mile → Scotch Whisky Experience (o Camera Obscura) → Gladstone''s Land → Victoria Street → Grassmarket → Cementerio Greyfriars → Museo Nacional de Escocia (gratis, oveja Dolly) → Catedral St Giles → Mary King''s Close → Palacio de Holyrood → Calton Hill al atardecer.', 1),
('z3-d2-p2', 'z3-d2', null, 'Recorrido Día 2: Monumento a Scott (abre 10:00, 287 escalones) → Princes Street Gardens → Galería Nacional (gratis) → Dean Village → Jardín Botánico → Stockbridge (Circus Lane) → Charlotte Square → Arthur''s Seat al atardecer (1 h de subida, calzado cómodo y agua).', 2),
('z5-d1-p1', 'z5-d1', null, 'Tarde en Montmartre (estamos alojados ahí): Muro Je t''aime, Rue Lepic, Place du Tertre, Basílica del Sagrado Corazón; a la noche Pigalle y Moulin Rouge por afuera.', 1),
('z5-d1-p2', 'z5-d1', null, 'Parte del recorrido Día 1: Iglesia de la Madeleine → Jardín de las Tullerías → Plaza de la Concordia → Campos Elíseos → Arco del Triunfo.', 2),
('z5-d2-p1', 'z5-d2', null, 'Recorrido Día 3: Sainte Chapelle → Notre Dame → Conciergerie → Ayuntamiento → Le Marais (Plaza des Vosges) → Barrio Latino (Shakespeare & Co, Panteón) → Jardines de Luxemburgo → Torre Montparnasse.', 1),
('z5-d2-p2', 'z5-d2', null, 'Trocadero de noche para ver la Torre Eiffel iluminada (destellos cada hora en punto).', 2),
('z5-d3-p1', 'z5-d3', null, 'Recorrido Día 2 (arranca en el Louvre): Jardines del Palacio Real → Galería Vivienne → Biblioteca Nacional → Plaza Vendôme → Ópera Garnier (cierra 17:00) → Galerías Lafayette (terraza con vistas) → Passage des Panoramas → Les Halles (Centro Pompidou) → paseo en barco por el Sena al atardecer.', 1),
('z6-d4-p1', 'z6-d4', null, 'Ir temprano al Camp Nou', 1),
('z6-d4-p2', 'z6-d4', null, 'Ver qué hacer el resto del día', 2),
('z6-d5-p1', 'z6-d5', null, 'Organizar salida con los chicos a la noche', 1),
('z6-d5-p2', 'z6-d5', null, 'Ver qué hacer el resto del día', 2),
('z6-d6-p1', 'z6-d6', null, 'Probablemente compras', 1),
('z7-d1-p1', 'z7-d1', null, 'Decidir a qué hora ir a Madrid', 1);

-- Links de propuestas
insert into proposal_links (id, proposal_id, label, url) values
('z2-d1-p1-l1', 'z2-d1-p1', 'Free tour Londres', 'https://www.civitatis.com/ar/londres/free-tour-londres/'),
('z2-d2-p1-l1', 'z2-d2-p1', 'Free tour Camden Town', 'https://www.civitatis.com/ar/londres/free-tour-camden-town/'),
('z2-d2-p2-l1', 'z2-d2-p2', 'Free tour Museo Británico', 'https://www.civitatis.com/ar/londres/free-tour-museo-britanico/'),
('z2-d2-p3-l1', 'z2-d2-p3', 'Torre de Londres', 'https://www.hrp.org.uk/tower-of-london/'),
('z2-d2-p3-l2', 'z2-d2-p3', 'Mapa del recorrido', 'https://www.google.com/maps/d/viewer?mid=1O1sacThuX1AfPVeOcG6hOX17wBz4_G4'),
('z2-d3-p1-l1', 'z2-d3-p1', 'Free tour Notting Hill', 'https://www.civitatis.com/ar/londres/free-tour-notting-hill/'),
('z2-d3-p1-l2', 'z2-d3-p1', 'Free tour Soho / Covent Garden', 'https://www.civitatis.com/ar/londres/free-tour-soho-covent-garden/'),
('z2-d3-p1-l3', 'z2-d3-p1', 'Mapa del recorrido', 'https://www.google.com/maps/d/viewer?mid=1fRjMEG3z1znemhJPnxm5rEhQlQIKS68'),
('z2-d4-p1-l1', 'z2-d4-p1', 'Horizon 22', 'https://horizon22.co.uk/book/'),
('z2-d4-p1-l2', 'z2-d4-p1', 'Mapa del recorrido', 'https://www.google.com/maps/d/viewer?mid=11CKWEk0O_llcQt5UxeCLSLOuqaPiCjM'),
('z3-d1-p1-l1', 'z3-d1-p1', 'Royal Edinburgh Ticket', 'https://www.civitatis.com/es/edimburgo/royal-edinburgh-ticket/'),
('z3-d2-p1-l1', 'z3-d2-p1', 'Reservar Mary King''s Close', 'https://www.getyourguide.es/edimburgo-l44/edimburgo-tour-por-debajo-de-la-royal-mile-t76378/'),
('z3-d2-p1-l2', 'z3-d2-p1', 'Mapa del recorrido', 'https://www.google.com/maps/d/viewer?mid=1FpW4kBB8sBMGQtpyGMq3SzGPDVdSo_A'),
('z3-d2-p2-l1', 'z3-d2-p2', 'Mapa del recorrido', 'https://www.google.com/maps/d/viewer?mid=1tUotZmdo--eLKCkPc5BJqNSVKsvbA8Q'),
('z5-d1-p2-l1', 'z5-d1-p2', 'Mapa del recorrido', 'https://www.google.com/maps/d/viewer?mid=1B6L5PncYojr68CmnxZQbuE9JiV8YtQM'),
('z5-d2-p1-l1', 'z5-d2-p1', 'Reservar Notre Dame (gratis)', 'https://resa.notredamedeparis.fr/en/reservationindividuelle/tickets'),
('z5-d2-p1-l2', 'z5-d2-p1', 'Mapa del recorrido', 'https://www.google.com/maps/d/viewer?mid=1JyGe5cvK3bdeQXyaMXxaeIjg_BoAaJo'),
('z5-d3-p1-l1', 'z5-d3-p1', 'Paseo en barco por el Sena', 'https://www.civitatis.com/es/paris/paseo-barco-sena/'),
('z5-d3-p1-l2', 'z5-d3-p1', 'Mapa del recorrido', 'https://www.google.com/maps/d/viewer?mid=1vuNx4VmIwU6DmuZR2dvtsZqz5UQ78oI');
