// src/lib/server/hero.ts (or hero.s.ts)
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

    if (!res.ok) {
      console.error("❌ Banner API failed", res.status);
      return null;
    }

    const json = await res.json();

    // ✅ handle correct response shape
    const list = Array.isArray(json)
      ? json
      : json.data;

    if (!Array.isArray(list) || list.length === 0) {
      console.error("❌ No banners found", json);
      return null;
    }

    // 🔥 FIRST BANNER AS HERO
    return list[0];
  } catch (err) {
    console.error("❌ Banner fetch crashed", err);
    return null;
  }
}
