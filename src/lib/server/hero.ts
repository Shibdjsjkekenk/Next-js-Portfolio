// src/lib/server/hero.ts
import SummaryApi from "@/common/SummaryApi";

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function getActiveBanner() {
  try {
    const res = await fetch(
      getBaseUrl() + SummaryApi.get_all_banners.url,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Banner API failed", res.status);
      return null;
    }

    const json = await res.json();

    const list = json?.data;

    if (!Array.isArray(list) || list.length === 0) {
      return null;
    }

    // 🔥 ONLY isActive MATTERS
    const activeBanner = list.find(
      (b: any) => b.isActive === true
    );

    // fallback safety
    return activeBanner ?? list[0];
  } catch (err) {
    console.error("Banner fetch crashed", err);
    return null;
  }
}
