"use client";

import { useEffect, useRef } from "react";

interface AnimateOnViewProps {
  delay?: number;
  duration?: number;
}

export default function AnimateOnView({
  children,
  delay = 0,
  duration = 300,
  ...props
}: React.ComponentProps<"div"> & AnimateOnViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(
      "p, div, h1, h2, h3, h4, h5, h6, span, a, button, section, article, header, footer, main, aside, nav, ul, ol, li",
    );

    const animations: Animation[] = [];

    for (const [i, element] of elements.entries()) {
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
  }, [delay, duration]);

  return (
    <div ref={containerRef} {...props}>
      {children}
    </div>
  );
}
