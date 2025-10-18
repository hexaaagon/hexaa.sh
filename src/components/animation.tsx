"use client";

import { useEffect, useRef, useState } from "react";

interface AnimateOnViewProps {
  delay?: number;
  duration?: number;
  skipFirstElements?: number;
}

// Global flag to track if we've navigated (not refreshed)
let hasNavigated = false;

export default function AnimateOnView({
  children,
  delay = 0,
  duration = 300,
  skipFirstElements = 0,
  ...props
}: React.ComponentProps<"div"> & AnimateOnViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldSkipNavbar, setShouldSkipNavbar] = useState(hasNavigated);

  useEffect(() => {
    // After this component mounts, mark that we've navigated
    // So the next navigation will skip the navbar
    hasNavigated = true;
    setShouldSkipNavbar(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(
      "p, div, h1, h2, h3, h4, h5, h6, span, a, button, section, article, header, footer, main, aside, nav, ul, ol, li",
    );

    console.log(
      `[AnimateOnView] Total elements: ${elements.length}, Skipping first: ${skipFirstElements}, Should skip navbar: ${shouldSkipNavbar}`,
    );

    const animations: Animation[] = [];

    for (const [i, element] of elements.entries()) {
      // Skip navbar elements only on subsequent navigations (not on fresh page load)
      if (shouldSkipNavbar && i < skipFirstElements) {
        console.log(`[AnimateOnView] Skipping element ${i}:`, element.tagName);
        continue;
      }

      console.log(
        `[AnimateOnView] Animating element ${i}:`,
        element.tagName,
        element.textContent?.substring(0, 30),
      );
      const htmlElement = element as HTMLElement;
      const elementDelay = delay + i * 50;

      let originalStyleAttr = htmlElement.getAttribute("data-original-style");
      if (originalStyleAttr === null) {
        originalStyleAttr = htmlElement.getAttribute("style");
        htmlElement.setAttribute(
          "data-original-style",
          originalStyleAttr || "",
        );
      }

      htmlElement.style.opacity = "0";
      htmlElement.style.visibility = "hidden";
      htmlElement.style.transition = "none";
      htmlElement.style.willChange = "transform, opacity";

      const animation = htmlElement.animate(
        [
          {
            opacity: 0,
            transform: "translateY(20px) scale(0.95)",
            visibility: "hidden",
          },
          {
            opacity: 1,
            transform: "translateY(0px) scale(1)",
            visibility: "visible",
          },
        ],
        {
          duration,
          delay: elementDelay,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: "forwards",
        },
      );

      animations.push(animation);

      animation.addEventListener("finish", () => {
        animation.cancel();

        const storedOriginalStyles = htmlElement.getAttribute(
          "data-original-style",
        );
        if (storedOriginalStyles && storedOriginalStyles !== "") {
          htmlElement.setAttribute("style", storedOriginalStyles);
        } else {
          htmlElement.removeAttribute("style");
        }

        htmlElement.removeAttribute("data-original-style");
      });
    }

    // Cleanup function to cancel animations and restore styles if component unmounts
    return () => {
      animations.forEach((animation) => {
        if (animation.playState !== "finished") {
          animation.cancel();
        }
      });

      // Restore original styles for any elements that still have the data attribute
      elements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const storedOriginalStyles = htmlElement.getAttribute(
          "data-original-style",
        );
        if (storedOriginalStyles !== null) {
          if (storedOriginalStyles !== "") {
            htmlElement.setAttribute("style", storedOriginalStyles);
          } else {
            htmlElement.removeAttribute("style");
          }
          htmlElement.removeAttribute("data-original-style");
        }
      });
    };
  }, [delay, duration, skipFirstElements, shouldSkipNavbar]);

  return (
    <div ref={containerRef} {...props}>
      {children}
    </div>
  );
}
