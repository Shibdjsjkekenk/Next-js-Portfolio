// src/lib/server/hero.ts  (or hero.s.ts)
import SummaryApi from "@/common/SummaryApi";

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function getActiveBanner() {
  try {
    const baseUrl = getBaseUrl();

    const res = await fetch(
      baseUrl + SummaryApi.get_all_banners.url,
      {
        method: SummaryApi.get_all_banners.method,
        cache: "no-store",
      }
    );

    // 🔑 NEVER THROW
    if (!res.ok) {
      console.error("❌ Banner API failed:", res.status);
      return null;
    }

    const json = await res.json();

    const list = Array.isArray(json)
      ? json
      : json?.data;

    if (!Array.isArray(list)) {
      console.error("❌ Banner response invalid:", json);
      return null;
    }

    return list.find((b: any) => b.isActive) ?? null;
  } catch (err) {
    console.error("❌ Banner fetch crashed:", err);
    return null; // 🔑 ABSOLUTELY CRITICAL
  }
}
