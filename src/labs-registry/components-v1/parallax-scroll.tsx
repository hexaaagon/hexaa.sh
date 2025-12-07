"use client";

import { useEffect, useRef } from "react";
import type React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { cn } from "@/lib/utils";

export interface ParallaxLayerProps {
  children?: React.ReactNode;
  layer: string;
  className?: string;
}

export function ParallaxLayer({
  children,
  layer,
  className,
}: ParallaxLayerProps) {
  return (
    <div data-parallax-layer={layer} className={cn(className)}>
      {children}
    </div>
  );
}

export interface ParallaxScrollProps {
  children: React.ReactNode;
  classNames?: {
    wrapper?: string;
    section?: string;
    container?: string;
    layers?: string;
    fade?: string;
  };
  layers?: ParallaxLayer[];
}

export interface ParallaxLayer {
  layer: string;
  yPercent: number;
}

export function ParallaxScroll({
  children,
  classNames,
  layers = [
    { layer: "1", yPercent: 70 },
    { layer: "2", yPercent: 55 },
    { layer: "3", yPercent: 40 },
    { layer: "4", yPercent: 10 },
  ],
}: ParallaxScrollProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector(
      "[data-parallax-layers]",
    );

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0,
        },
      });

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(
            `[data-parallax-layer="${layerObj.layer}"]`,
          ),
          {
            yPercent: layerObj.yPercent,
            ease: "none",
          },
          idx === 0 ? undefined : "<",
        );
      });
    }

    const lenis = new Lenis();
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      for (const st of ScrollTrigger.getAll()) {
        st.kill();
      }
      if (triggerElement) {
        gsap.killTweensOf(triggerElement);
      }
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, [layers]);

  return (
    <div ref={parallaxRef} className={cn("relative", classNames?.wrapper)}>
      <section className={cn("relative", classNames?.section)}>
        <div className={cn("relative overflow-hidden", classNames?.container)}>
          <div
            data-parallax-layers
            className={cn("relative", classNames?.layers)}
          >
            {children}
          </div>
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-[10vw] bg-linear-to-t from-dark-background to-transparent",
              classNames?.fade,
            )}
          />
        </div>
      </section>
    </div>
  );
}
