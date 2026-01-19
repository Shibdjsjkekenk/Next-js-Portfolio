import SummaryApi from "@/common/SummaryApi";

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function getAbout() {
  const baseUrl = getBaseUrl();

  const res = await fetch(baseUrl + SummaryApi.get_all_about.url, {
    method: SummaryApi.get_all_about.method,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch About data");
  }

  const json = await res.json();
  const list = Array.isArray(json)
    ? json
    : json.data;

  return list?.[0] ?? null;
}
