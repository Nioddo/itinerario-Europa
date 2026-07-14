export type ActivityType = "actividad" | "viaje" | "comida";
export type TravelMode = "avion" | "tren" | "auto";
export type AttachmentType = "link" | "pdf";
export type ZoneColor =
  | "verde"
  | "rojo"
  | "azul"
  | "violeta"
  | "dorado"
  | "naranja"
  | "gris";

export interface Attachment {
  id: string;
  activity_id?: string;
  tipo: AttachmentType;
  label: string;
  url: string | null;
  storage_path: string | null;
}

export interface Activity {
  id: string;
  day_id?: string;
  hora: string | null;
  titulo: string;
  descripcion: string | null;
  /** Emoji elegido para la actividad; si falta, se infiere del tipo. */
  icono?: string | null;
  tipo: ActivityType;
  medio_viaje: TravelMode | null;
  orden: number;
  attachments: Attachment[];
}

export interface ProposalLink {
  id: string;
  proposal_id?: string;
  label: string;
  url: string;
}

export interface Proposal {
  id: string;
  day_id?: string;
  /** Título corto; las propuestas viejas pueden no tenerlo. */
  titulo?: string | null;
  texto: string;
  orden: number;
  links: ProposalLink[];
}

export interface Day {
  id: string;
  zone_id?: string;
  fecha: string; // YYYY-MM-DD
  nota_del_dia: string | null;
  activities: Activity[];
  proposals: Proposal[];
}

export interface Zone {
  id: string;
  nombre: string;
  subtitulo: string | null;
  fecha_desde: string;
  fecha_hasta: string;
  color: ZoneColor;
  orden: number;
  info_alojamiento: string | null;
  link_alojamiento: string | null;
  days: Day[];
}

export interface TripMeta {
  titulo: string;
  subtitulo: string;
  fecha_desde: string;
  fecha_hasta: string;
}

export interface Itinerary {
  viaje: TripMeta;
  zones: Zone[];
}
