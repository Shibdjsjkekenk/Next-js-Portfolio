// src/components/server/Hero.s.tsx
import HeroClient from "@/components/client-view/HeroClient";
import { getActiveBanner } from "@/lib/server/hero";

export default async function Hero() {
  const banner = await getActiveBanner();
  return <HeroClient banner={banner} />;
}
