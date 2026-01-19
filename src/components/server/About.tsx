import HeroClient from "@/components/client-view/HeroClient";
import { getActiveBanner } from "@/lib/server/hero";

export default async function Hero() {
  const banner = await getActiveBanner();

  if (!banner) {
    console.log("❌ Banner is null");
    return null;
  }

  return <HeroClient banner={banner} />;
}
