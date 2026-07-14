import "server-only";
import demo from "../../supabase/itinerary.json";
import { getReadClient, isSupabaseConfigured } from "./supabase";
import type {
  Activity,
  Attachment,
  Day,
  Itinerary,
  Proposal,
  ProposalLink,
  Zone,
} from "./types";

export const IS_DEMO = !isSupabaseConfigured();

const TRIP = demo.viaje;

/** Carga el itinerario completo (Supabase o, si no está configurado, datos demo). */
export async function getItinerary(): Promise<Itinerary> {
  if (!isSupabaseConfigured()) {
    return demo as unknown as Itinerary;
  }

  const sb = getReadClient();
  const [zonesR, daysR, actsR, attsR, propsR, linksR] = await Promise.all([
    sb.from("zones").select("*"),
    sb.from("days").select("*"),
    sb.from("activities").select("*"),
    sb.from("attachments").select("*"),
    sb.from("proposals").select("*"),
    sb.from("proposal_links").select("*"),
  ]);

  const firstError = [zonesR, daysR, actsR, attsR, propsR, linksR].find((r) => r.error)?.error;
  if (firstError) throw new Error(`Error leyendo datos: ${firstError.message}`);

  const atts = (attsR.data ?? []) as Attachment[];
  const links = (linksR.data ?? []) as ProposalLink[];

  const activities: Activity[] = (actsR.data ?? []).map((a: any) => ({
    ...a,
    attachments: atts
      .filter((x) => x.activity_id === a.id)
      .sort((x, y) => x.label.localeCompare(y.label)),
  }));

  const proposals: Proposal[] = (propsR.data ?? []).map((p: any) => ({
    ...p,
    links: links.filter((x) => x.proposal_id === p.id),
  }));

  const days: Day[] = (daysR.data ?? []).map((d: any) => ({
    ...d,
    activities: activities
      .filter((a) => a.day_id === d.id)
      .sort((a, b) => a.orden - b.orden),
    proposals: proposals
      .filter((p) => p.day_id === d.id)
      .sort((a, b) => a.orden - b.orden),
  }));

  const zones: Zone[] = ((zonesR.data ?? []) as any[])
    .map((z) => ({
      ...z,
      days: days
        .filter((d) => d.zone_id === z.id)
        .sort((a, b) => a.fecha.localeCompare(b.fecha)),
    }))
    .sort((a, b) => a.orden - b.orden);

  return { viaje: TRIP, zones };
}
