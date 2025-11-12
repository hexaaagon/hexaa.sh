"use client";

import * as React from "react";
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiGo,
  SiRust,
  SiTailwindcss,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiGit,
  SiVercel,
  SiFigma,
  SiBun,
} from "@icons-pack/react-simple-icons";
import { cn } from "@/lib/utils";

interface ToolItem {
  name: string;
  Icon: React.ComponentType<{ className?: string; size?: number | string }>;
  hex: string;
  classNames?: {
    icon?: string;
    container?: string;
  };
}

const tools: ToolItem[] = [
  { name: "JavaScript", Icon: SiJavascript, hex: "#F7DF1E" },
  { name: "TypeScript", Icon: SiTypescript, hex: "#3178C6" },
  { name: "React", Icon: SiReact, hex: "#61DAFB" },
  { name: "Next.js", Icon: SiNextdotjs, hex: "#000000" },
  { name: "Node.js", Icon: SiNodedotjs, hex: "#339933" },
  { name: "Python", Icon: SiPython, hex: "#3776AB" },
  { name: "Go", Icon: SiGo, hex: "#00ADD8" },
  { name: "Rust", Icon: SiRust, hex: "#000000" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, hex: "#06B6D4" },
  { name: "PostgreSQL", Icon: SiPostgresql, hex: "#4169E1" },
  { name: "MongoDB", Icon: SiMongodb, hex: "#47A248" },
  { name: "Docker", Icon: SiDocker, hex: "#2496ED" },
  { name: "Git", Icon: SiGit, hex: "#F05032" },
  { name: "Vercel", Icon: SiVercel, hex: "#000000" },
  { name: "Figma", Icon: SiFigma, hex: "#F24E1E" },
  { name: "Bun", Icon: SiBun, hex: "#FBF0DF" },
];

interface LanguagesToolsProps {
  className?: string;
  items?: ToolItem[];
  variant?: "default" | "compact";
}

export function LanguagesTools({
  className,
  items = tools,
  variant = "default",
}: LanguagesToolsProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const itemCount = items.length;

  // Calculate responsive columns based on item count
  const getColumnsConfig = (breakpoint: "mobile" | "tablet" | "desktop") => {
    const maxItemCols = {
      mobile: 3,
      tablet: variant === "default" ? 5 : 4,
      desktop: variant === "default" ? 8 : 6,
    };
    const maxCols = maxItemCols[breakpoint];

    // Check if items fit in one row or need multiple rows
    const fitsInOneRow = itemCount <= maxCols;
    const needsLastRowCenter = !fitsInOneRow;

    // If needs last-row-center, double the columns (each item spans 2)
    // Otherwise, use exact number of items
    const columns = needsLastRowCenter ? maxCols * 2 : itemCount;

    return { columns, needsLastRowCenter, maxCols };
  };

  const mobileConfig = getColumnsConfig("mobile");
  const tabletConfig = getColumnsConfig("tablet");
  const desktopConfig = getColumnsConfig("desktop");

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${mobileConfig.columns}, minmax(0, 1fr))`,
    gap: variant === "default" ? "1rem" : "0.5rem",
    margin: "0 auto",
    width: "fit-content",
  };

  const itemVariants = {
    default: "flex flex-col items-center gap-2 group cursor-default",
    compact: "flex items-center gap-2 group cursor-default",
  };

  return (
    <>
      <style>{`
        @media (min-width: 640px) {
          .languages-tools-grid {
            grid-template-columns: repeat(${tabletConfig.columns}, minmax(0, 1fr)) !important;
          }
        }
        
        @media (min-width: 768px) {
          .languages-tools-grid {
            grid-template-columns: repeat(${desktopConfig.columns}, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
      <div
        className={cn(
          "languages-tools-grid",
          mobileConfig.needsLastRowCenter &&
            "last-row-center col-span-2-mobile",
          tabletConfig.needsLastRowCenter
            ? "sm:col-span-2"
            : "sm:last-row-reset sm:col-span-auto",
          desktopConfig.needsLastRowCenter
            ? "md:col-span-2"
            : "md:last-row-reset md:col-span-auto",
          className,
        )}
        style={gridStyle}
      >
        {items.map((tool, index) => {
          const isHovered = hoveredIndex === index;
          const iconColor = isHovered ? tool.hex : "currentColor";

          return (
            <button
              type="button"
              key={tool.name}
              className={cn(itemVariants[variant], tool.classNames?.container)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="scale-101 transform transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:invert"
                style={{ color: iconColor }}
              >
                <tool.Icon
                  className={cn(
                    "transition-colors duration-300",
                    tool.classNames?.icon,
                  )}
                  size={variant === "compact" ? 20 : 32}
                />
              </div>
              {variant === "default" && (
                <span
                  className={cn(
                    "font-medium text-muted-foreground text-xs transition-colors duration-300",
                    isHovered && "text-foreground",
                  )}
                >
                  {tool.name}
                </span>
              )}
              {variant === "compact" && (
                <span
                  className={cn(
                    "font-medium text-muted-foreground text-sm transition-colors duration-300",
                    isHovered && "text-foreground",
                  )}
                >
                  {tool.name}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

export type { ToolItem };
export { tools };
