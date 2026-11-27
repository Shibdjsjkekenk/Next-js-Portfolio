import HeroClient from "@/components/client-view/HeroClient";
import { getActiveBanner } from "@/lib/server/hero";

export default async function Hero() {
  const banner = await getActiveBanner();

  // MAKE IT JSON-SAFE
  const safeBanner = banner
    ? JSON.parse(JSON.stringify(banner))
    : null;

  return <HeroClient banner={safeBanner} />;
}
