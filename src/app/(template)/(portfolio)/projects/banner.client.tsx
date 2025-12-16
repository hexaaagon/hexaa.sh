"use client";
import dynamic from "next/dynamic";
import { PlusSeparator } from "@/components/ui/plus-separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

const GrainGradient = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.GrainGradient),
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
          <div className="h-[250px] w-full">
            <GrainGradient
              height={250}
              colors={["#3930c6", "#4151be", "#392d39"]}
              colorBack="#ffffff00"
              softness={0.7}
              intensity={0.15}
              noise={isMobile ? 0.25 : 0.5}
              shape="wave"
              speed={0.7}
              scale={isMobile ? 1 : 2.5}
              offsetX={-3}
              offsetY={1}
              className="h-full w-full animate-fd-fade-in bg-background/80 duration-1000"
            />
          </div>
        ) : (
          <div className="h-[250px] w-full" />
        )}
        <div className="absolute top-0 right-0 bottom-0 left-0 z-10 h-full w-full text-white mix-blend-difference">
          <div className="mx-10 mt-12 flex h-full flex-col">
            <h2 className="text-2xl md:text-4xl">hexaa's projects.</h2>
            <p className="max-w-2xl text-sm md:text-base">
              here are the projects I've worked on, showcasing my skills and
              passion for software development. each project reflects my
              commitment to creating impactful solutions and continuous
              learning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
