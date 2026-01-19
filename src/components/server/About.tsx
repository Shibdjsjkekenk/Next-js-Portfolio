import AboutSection from "@/components/client-view/AboutSection";
import { getAbout } from "@/lib/server/about";

export default async function About() {
  const about = await getAbout();
  return <AboutSection about={about} />;
}
