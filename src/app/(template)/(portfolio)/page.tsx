import HeroSection from "./hero";
import AboutSection from "./about";
import ProjectSection from "./projects";
import { PlusSeparator } from "@/components/ui/plus-separator";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ProjectSection />
      <main className="w-full border-separator/10 border-t">
        <div className="inner relative flex h-24 border-separator/10 border-x">
          <PlusSeparator position={["top-left", "top-right"]} />
        </div>
      </main>
    </main>
  );
}
