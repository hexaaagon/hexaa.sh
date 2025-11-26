"use client";

import { PlusSeparator } from "@/components/ui/plus-separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { GrainGradient } from "@paper-design/shaders-react";

export function HeaderBanner() {
  const isMobile = useIsMobile();

  return (
    <section className="w-full border-separator/10 border-b">
      <div className="inner relative flex border-separator/10 border-x">
        <PlusSeparator
          position={["top-left", "top-right", "bottom-left", "bottom-right"]}
          main={{ className: "z-20" }}
        />
        <GrainGradient
          height={250}
          colors={["#c6750c", "#beae60", "#d7cbc6"]}
          colorBack="#ffffff00"
          softness={0.7}
          intensity={0.15}
          noise={isMobile ? 0.25 : 0.5}
          shape="wave"
          speed={0.7}
          scale={isMobile ? 1 : 2.5}
          offsetX={1}
          offsetY={0.6}
          className="w-full bg-background/20"
        />
        <div className="absolute top-0 right-0 bottom-0 left-0 z-10 h-full w-full text-white mix-blend-difference">
          <div className="mt-12 ml-10 flex h-full flex-col">
            <h2 className="text-2xl md:text-4xl">hexaa's blog.</h2>
            <p className="text-sm md:text-base">
              here goes another yap and yap
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
