import SummaryApi from "@/common/SummaryApi";

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function getActiveBanner() {
  const baseUrl = getBaseUrl();

  const res = await fetch(
    baseUrl + SummaryApi.get_all_banners.url,
    {
      method: SummaryApi.get_all_banners.method,
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch banners");
  }

  const json = await res.json();
  const list = Array.isArray(json) ? json : json.data;

  return list?.find((b: any) => b.isActive) ?? null;
}
