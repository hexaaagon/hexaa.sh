"use client";
import dynamic from "next/dynamic";
import { PlusSeparator } from "@/components/ui/plus-separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

const Dithering = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.Dithering),
  {
    ssr: false,
  },
);

export function HeaderBanner() {
  const [showShaders, setShowShaders] = useState(false);
  useEffect(() => {
    // apply some delay, otherwise on slower devices, it errors with uniform images not being fully loaded.
    setTimeout(() => {
      setShowShaders(true);
    }, 400);
  }, []);

  const isMobile = useIsMobile();

  return (
    <section className="w-full border-separator/10 border-b">
      <div className="inner relative flex min-h-[250px] border-separator/10 border-x">
        <PlusSeparator
          position={["top-left", "top-right", "bottom-left", "bottom-right"]}
          main={{ className: "z-20" }}
        />
        {showShaders ? (
          <div className="h-[250px] w-full opacity-20">
            <Dithering
              height={250}
              colorBack="#ffffff00"
              shape="simplex"
              speed={0.4}
              scale={isMobile ? 0.4 : 0.8}
              offsetX={1}
              offsetY={0.6}
              className="h-full w-full animate-fd-fade-in bg-background/20 duration-1000"
            />
          </div>
        ) : (
          <div className="h-[250px] w-full" />
        )}
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
