import Hero from "@/components/server/Hero";
import About from "@/components/server/About";
import Timeline from "@/components/server/Timeline";
import CategoryCarousel from "@/components/client-view/CategoryCarousel";
import SkillSection from "@/components/client-view/SkillSection";
import Projects from "@/components/server/projects";
import MyExpertise from "@/components/client-view/MyExpertise";


export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Timeline />
      <CategoryCarousel />
      <SkillSection />
      <Projects />
      <MyExpertise/>
    </>
  );
}