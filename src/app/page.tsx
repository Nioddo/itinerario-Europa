import { getItinerary, IS_DEMO } from "@/lib/data";
import { isEditor } from "@/lib/auth";
import { Itinerary } from "@/components/Itinerary";

export const dynamic = "force-dynamic";

export default async function Home() {
  const itinerary = await getItinerary();
  const editor = isEditor();
  return <Itinerary data={itinerary} editor={editor} isDemo={IS_DEMO} />;
}
