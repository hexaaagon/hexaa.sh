"use client";
import { animated, type SpringValue, useSprings } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";

interface SplitTextProps {
  text?: string;
  className?: string;
  delay?: number;
  animationFrom?: { opacity: number; transform: string };
  animationTo?: { opacity: number; transform: string };
  easing?: (t: number) => number;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "right" | "center" | "justify" | "initial" | "inherit";
  onLetterAnimationComplete?: () => void;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text = "",
  className = "",
  delay = 100,
  animationFrom = { opacity: 0, transform: "translate3d(0,40px,0)" },
  animationTo = { opacity: 1, transform: "translate3d(0,0,0)" },
  easing = (t) => t,
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const words = text.split(" ").map((w) => w.split(""));
  const letters = words.flat();

  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const animatedCount = useRef(0);

  useEffect(() => {
    if (!ref.current) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(ref.current as Element);
        }
      },
      { threshold, rootMargin },
    );

    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold, rootMargin]);

  const springs = useSprings(
    letters.length,
    letters.map((_, i) => ({
      from: animationFrom,
      to: inView
        ? async (
            next: (step: Record<string, string | number>) => Promise<void>,
          ) => {
            await next(animationTo);
            animatedCount.current += 1;
            if (
              animatedCount.current === letters.length &&
              onLetterAnimationComplete
            ) {
              onLetterAnimationComplete();
            }
          }
        : animationFrom,
      delay: i * delay,
      config: { easing },
    })),
  );

  return (
    <p
      ref={ref}
      className={`split-parent inline overflow-hidden ${className}`}
      style={{ textAlign: textAlign }}
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap">
          {word.map((letter, lIdx) => {
            const index =
              words.slice(0, wIdx).reduce((acc, w) => acc + w.length, 0) + lIdx;

            return (
              <animated.span
                key={index}
                style={
                  {
                    ...springs[index],
                    display: "inline-block",
                    willChange: "transform, opacity",
                  } as unknown as Record<string, SpringValue | string | number>
                }
              >
                {letter}
              </animated.span>
            );
          })}
          <span className="inline-block w-[0.3em]">&nbsp;</span>
        </span>
      ))}
    </p>
  );
};
