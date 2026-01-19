// src/components/server/Hero.s.tsx
import HeroClient from "@/components/client-view/HeroClient";
import { getActiveBanner } from "@/lib/server/hero";

export default async function Hero() {
  const banner = await getActiveBanner();

  // 🔑 agar banner nahi mila → page crash nahi karega
  if (!banner) {
    return null; // ya simple fallback JSX
  }

  return <HeroClient banner={banner} />;
}
