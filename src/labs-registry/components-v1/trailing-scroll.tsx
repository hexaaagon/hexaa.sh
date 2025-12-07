"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface TrailingEffectProps {
  elements: (ParallaxImage | ParallaxElement)[];
  className?: string;
  containerClassName?: string;
  speedMultiplier?: number;
  startY?: number;
  fadeStart?: string;
  fadeEnd?: string;
  scrub?: boolean | number;
}

export interface ParallaxImage {
  id: string;
  src: string;
  alt: string;
  speed: number;
  className: string;
  width?: number;
}

export interface ParallaxElement {
  id: string;
  component: React.ReactNode;
  speed: number;
  className: string;
}

export default function TrailingScroll({
  elements,
  className = "",
  containerClassName = "",
  speedMultiplier = 100,
  startY = 100,
  fadeStart = "top bottom",
  fadeEnd = "bottom top",
  scrub = true,
}: TrailingEffectProps) {
  useEffect(() => {
    const section = document.querySelector("[data-trailing-section]");
    if (!section) return;

    const triggers: ScrollTrigger[] = [];

    // Parallax animation function
    function parallaxScrollBySpeed(selector: string, speed = 1) {
      const el = document.querySelector(selector);
      if (!el) return;

      const animation = gsap.fromTo(
        el,
        { y: startY, opacity: 1 },
        {
          y: (speed - 1) * -speedMultiplier,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: fadeStart,
            end: fadeEnd,
            scrub: scrub,
          },
        },
      );

      const trigger = animation.scrollTrigger;
      if (trigger) {
        triggers.push(trigger);
      }
    }

    // Apply parallax to each element with a slight delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      elements.forEach((element) => {
        parallaxScrollBySpeed(`[data-parallax="${element.id}"]`, element.speed);
      });

      // Refresh ScrollTrigger to recalculate positions after all animations are set
      ScrollTrigger.refresh();
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      triggers.forEach((trigger) => {
        trigger.kill();
      });
    };
  }, [elements, speedMultiplier, startY, fadeStart, fadeEnd, scrub]);

  return (
    <div
      data-trailing-section
      className={`pointer-events-none absolute bottom-0 w-full ${containerClassName}`}
    >
      <div className={`absolute inset-0 ${className}`}>
        {elements.map((element) => {
          if (isParallaxImage(element)) {
            return (
              <img
                key={element.id}
                data-parallax={element.id}
                src={element.src}
                alt={element.alt}
                width={element.width}
                className={element.className}
              />
            );
          }

          return (
            <div
              key={element.id}
              data-parallax={element.id}
              className={element.className}
            >
              {element.component}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isParallaxImage(
  element: ParallaxImage | ParallaxElement,
): element is ParallaxImage {
  return "src" in element;
}
