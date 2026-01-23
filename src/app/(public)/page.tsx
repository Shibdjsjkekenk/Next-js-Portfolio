import Hero from "@/components/server/Hero";
import About from "@/components/server/About";
import Timeline from "@/components/server/Timeline";
import SkillSection from "@/components/client-view/SkillSection";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Timeline />
      <SkillSection/>
    </>
  );
}
