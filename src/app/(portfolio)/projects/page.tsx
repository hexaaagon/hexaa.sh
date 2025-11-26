import { PathUtils } from "fumadocs-core/source";

import { PlusSeparator } from "@/components/ui/plus-separator";
import { HeaderBanner } from "./banner.client";
import { projectsData } from "@/content/portfolio/projects";
import { ProjectCard } from "@/components/project";

export default function ProjectsPage() {
  return (
    <main className="mt-16">
      <HeaderBanner />
      <section className="w-full border-separator/10 border-y">
        <div className="inner relative grid grid-cols-1 gap-2 border-separator/10 border-x p-2 md:grid-cols-2">
          {projectsData.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
          <PlusSeparator
            position={["bottom-left", "bottom-right"]}
            main={{ className: "z-20" }}
          />
        </div>
      </section>
    </main>
  );
}

function _getName(path: string) {
  return PathUtils.basename(path, PathUtils.extname(path));
}
