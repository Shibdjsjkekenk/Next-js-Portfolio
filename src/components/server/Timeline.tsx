import TimelineClient from "@/components/client-view/TimelineSection";
import { getActiveTimelines } from "@/lib/server/timeline";

export default async function Timeline() {
  const timelines = await getActiveTimelines();

  //  MAKE JSON SAFE (same as Hero)
  const safeTimelines = timelines
    ? JSON.parse(JSON.stringify(timelines))
    : [];

  if (!safeTimelines.length) return null;

  return <TimelineClient list={safeTimelines} />;
}
