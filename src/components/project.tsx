import Image from "next/image";
import Link from "next/link";

import type { ProjectItem } from "@/content/projects";

import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
}: {
  project: ProjectItem;
  classNames?: {
    container?: string;
    title?: string;
    description?: string;
    image?: string;
    buttons?: {
      github?: string;
      live?: string;
    };
  };
}) {
  return (
    <div
      className={cn(
        "group rou relative overflow-hidden rounded-xs border border-separator/10 bg-background transition-all hover:border-foreground/20",
      )}
    >
      {/* Image Section */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized={!project.image.endsWith(".gif")}
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-4 p-6">
        {/* Badges */}
        {project.badge && project.badge.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.badge.map((badge) => badge)}
          </div>
        )}

        {/* Title */}
        <h2
          className={cn(
            "font-semibold text-lg leading-tight md:text-xl",
            project.title.includes("-") && "font-mono",
          )}
        >
          {project.title}
        </h2>

        {/* Description */}
        <p className="max-w-lg text-muted-foreground text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Links */}
        <div className="flex gap-4 pt-2 font-mono">
          {project.repo && (
            <Link
              href={project.repo}
              target="_blank"
              className="font-medium text-blue-600 text-sm transition-all hover:underline dark:text-blue-400"
            >
              [github]
            </Link>
          )}
          {project.link && (
            <Link
              href={project.link}
              target="_blank"
              className="font-medium text-blue-600 text-sm transition-all hover:underline dark:text-blue-400"
            >
              [live demo]
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
