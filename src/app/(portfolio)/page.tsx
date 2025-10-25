import HeroSection from "./hero";
import AboutSection from "./about";
import ProjectSection from "./projects";
import SoonSection from "./soon";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ProjectSection />
      <SoonSection />
    </main>
  );
}
