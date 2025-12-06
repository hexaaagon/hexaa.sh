"use client";

import { PlusSeparator } from "@/components/ui/plus-separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dithering } from "@paper-design/shaders-react";

export function HeaderBanner() {
  const isMobile = useIsMobile();

  return (
    <section className="w-full border-separator/10 border-b">
      <div className="inner relative flex border-separator/10 border-x">
        <PlusSeparator
          position={["top-left", "top-right", "bottom-left", "bottom-right"]}
          main={{ className: "z-20" }}
        />
        <Dithering
          height={250}
          colorBack="#ffffff00"
          shape="simplex"
          speed={0.4}
          scale={isMobile ? 0.4 : 0.8}
          offsetX={1}
          offsetY={0.6}
          className="w-full bg-background/20"
        />
        <div className="absolute top-0 right-0 bottom-0 left-0 z-10 h-full w-full text-white mix-blend-difference">
          <div className="mt-12 ml-10 flex h-full flex-col">
            <h2 className="text-2xl md:text-4xl">who am i?</h2>
            <p className="text-sm md:text-base">
              uhh, ummm, uhh... well, i guess you can call me a developer, i
              guess?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
