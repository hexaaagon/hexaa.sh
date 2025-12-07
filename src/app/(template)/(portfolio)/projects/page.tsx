import { PathUtils } from "fumadocs-core/source";

import { HeaderBanner } from "./banner.client";
import { projectsData } from "@/content/portfolio/projects";
import { ProjectCard } from "@/components/portfolio/project";

export default function ProjectsPage() {
  return (
    <main>
      <section className="w-full border-separator/10 border-b">
        <div className="inner relative flex h-16 gap-2 border-separator/10 border-x p-2"></div>
      </section>
      <HeaderBanner />
      <section className="w-full border-separator/10">
        <div className="inner relative grid grid-cols-1 gap-2 border-separator/10 border-x p-2 md:grid-cols-2">
          {projectsData.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}

function _getName(path: string) {
  return PathUtils.basename(path, PathUtils.extname(path));
}
