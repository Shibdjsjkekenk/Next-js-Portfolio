import { Suspense } from "react";

import Hero from "@/components/server/Hero";
import About from "@/components/server/About";
import Timeline from "@/components/server/Timeline";
import CategoryCarousel from "@/components/client-view/CategoryCarousel";
import SkillSection from "@/components/client-view/SkillSection";
import Projects from "@/components/server/projects";
import MyExpertise from "@/components/client-view/MyExpertise";
// import OneProject from "@/components/client-view/OneProject";
// import Counter from "@/components/client-view/Counter";   // purana (backup)
import ImpactStory from "@/components/client-view/impact/ImpactStory";    // naya

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <Hero />
      </Suspense>

      {/* <OneProject/> */}
      {/* <Counter /> */}

      <ImpactStory />

      <Suspense fallback={null}>
        <About />
      </Suspense>

      <Suspense fallback={null}>
        <Timeline />
      </Suspense>

      <CategoryCarousel />
      <SkillSection />

      <Suspense fallback={null}>
        <Projects />
      </Suspense>

      <MyExpertise />
    </>
  );
}