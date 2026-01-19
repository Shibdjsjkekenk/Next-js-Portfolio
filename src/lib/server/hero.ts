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
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Banner API failed", res.status);
      return null;
    }

    const json = await res.json();

    // 🔥 YOUR API SHAPE
    const list = json?.data;

    if (!Array.isArray(list) || list.length === 0) {
      return null;
    }

    // FIRST banner
    return list[0];
  } catch (err) {
    console.error("Banner fetch crashed", err);
    return null;
  }
}
