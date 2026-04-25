export const dynamic = "force-dynamic";

import TimelineClient from "@/components/client-view/TimelineSection";
import { getActiveTimelines } from "@/lib/server/timeline";

export default async function Timeline() {
  const timelines = await getActiveTimelines();

  const safeTimelines = timelines
    ? JSON.parse(JSON.stringify(timelines))
    : [];

  if (!safeTimelines.length) return null;

  return <TimelineClient list={safeTimelines} />;
}