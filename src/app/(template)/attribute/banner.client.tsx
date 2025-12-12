"use client";
import dynamic from "next/dynamic";
import { PlusSeparator } from "@/components/ui/plus-separator";
import { useIsMobile } from "@/hooks/use-mobile";

const SimplexNoise = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.SimplexNoise),
  {
    ssr: false,
  },
);

export function HeaderBanner() {
  const isMobile = useIsMobile();

  return (
    <section className="w-full border-separator/10 border-b">
      <div className="inner relative flex border-separator/10 border-x">
        <PlusSeparator
          position={["top-left", "top-right", "bottom-left", "bottom-right"]}
          main={{ className: "z-20" }}
        />
        <SimplexNoise
          height={250}
          colors={["#3930c6", "#ffffff00", "#392d39"]}
          softness={0.7}
          speed={0.7}
          scale={isMobile ? 1 : 1}
          offsetX={-3}
          offsetY={1}
          className="w-full bg-background/80 opacity-80"
        />
        <div className="absolute top-0 right-0 bottom-0 left-0 z-10 h-full w-full text-white mix-blend-difference">
          <div className="mt-12 ml-10 flex h-full flex-col">
            <h2 className="text-2xl md:text-4xl">attributes.</h2>
            <p className="max-w-2xl text-sm md:text-base">
              thank you very much for taking the time to explore my portfolio. i
              would also like to express my gratitude to those who have open
              sourced their work, which has enabled many of these components and
              inspired me throughout this journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
