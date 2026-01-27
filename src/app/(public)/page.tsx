import Hero from "@/components/server/Hero";
import About from "@/components/server/About";
import Timeline from "@/components/server/Timeline";
import SkillSection from "@/components/client-view/SkillSection";
import ProjectsPage from "@/components/server/projects";
import CategoryCarousel from "@/components/client-view/CategoryCarousel";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Timeline />
      <CategoryCarousel />
      <SkillSection />
      <ProjectsPage />
    </>
  );
}
