// src/components/server/Hero.s.tsx
import HeroSection from "@/components/client-view/HeroSection";
import { getActiveBanner } from "@/lib/server/hero";

export default async function Hero() {
  const banner = await getActiveBanner();
  return <HeroSection banner={banner} />;
}
