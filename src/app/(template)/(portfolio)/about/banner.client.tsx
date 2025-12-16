"use client";

import { PlusSeparator } from "@/components/ui/plus-separator";
import { useIsMobile } from "@/hooks/use-mobile";
import type { SimplexNoiseProps } from "@paper-design/shaders-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SimplexNoise = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.SimplexNoise),
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
          <div className="h-[250px] w-full bg-background/20 opacity-50">
            <SimplexNoise
              height={250}
              colors={["#3930c6", "#ffffff00", "#392d39"]}
              softness={0.7}
              speed={0.7}
              scale={isMobile ? 1 : 1}
              offsetX={-3}
              offsetY={1}
              className="h-full w-full animate-fd-fade-in duration-1000"
            />
          </div>
        ) : (
          <div className="h-[250px] w-full" />
        )}
        <div className="absolute top-0 right-0 bottom-0 left-0 z-10 h-full w-full text-white mix-blend-difference">
          <div className="mx-10 mt-12 flex h-full flex-col">
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

export function SideNoise({
  colors = ["#ffffff00", "#121212", "#262626", "#4d4d4d", "#6e6e6e"],
  stepsPerColor = 3,
  softness = 0,
  speed = 0.38,
  className,
  style,
  ...props
}: SimplexNoiseProps) {
  const [showShaders, setShowShaders] = useState(false);
  useEffect(() => {
    // apply some delay, otherwise on slower devices, it errors with uniform images not being fully loaded.
    setTimeout(() => {
      setShowShaders(true);
    }, 1000);
  }, []);

  return showShaders ? (
    <div className={className} style={style}>
      <SimplexNoise
        colors={colors}
        stepsPerColor={stepsPerColor}
        softness={softness}
        speed={speed}
        className={"h-full w-full animate-fd-fade-in duration-1000"}
        {...props}
      />
    </div>
  ) : (
    <div className={className} style={style} />
  );
}
