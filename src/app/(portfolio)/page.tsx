import HeroSection from "./hero";
import AboutSection from "./about";
import SkillsSection from "./skills";
import ProjectSection from "./projects";
import SoonSection from "./soon";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectSection />
      <SoonSection />
    </main>
  );
}
