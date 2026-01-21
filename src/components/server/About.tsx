import AboutSection from "@/components/client-view/AboutSection";
import { getAbout } from "@/lib/server/about";

export default async function About() {
  const about = await getAbout();

  // MAKE IT JSON-SAFE
  const safeAbout = about
    ? JSON.parse(JSON.stringify(about))
    : null;

  return <AboutSection about={safeAbout} />;
}
