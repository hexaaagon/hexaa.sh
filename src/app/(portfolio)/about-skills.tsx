"use client";
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  Fragment,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

import Star12 from "@/components/stars/s12";
import Star15 from "@/components/stars/s15";
import Star28 from "@/components/stars/s28";
import Star3 from "@/components/stars/s3";
import Star40 from "@/components/stars/s40";
import { Marquee } from "@/components/ui/marquee";
import { PlusSeparator } from "@/components/ui/plus-separator";

import { skillsContent } from "@/content/skills";

const BASE_TIMING = 7.5;

export default function SkillsSection() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>("graphic");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  // mode drives the behavior deterministically: 'auto' = auto-rotating,
  // 'viewing' = user clicked a role (countdown from 100 -> 0),
  // 'paused' = viewing paused due to hover
  const [mode, setMode] = useState<"auto" | "viewing" | "paused">("auto");
  const [progress, setProgress] = useState(0);

  // timers
  const rotateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const restoreTimerRef = useRef<NodeJS.Timeout | null>(null);
  const savedProgressRef = useRef<number>(0);

  const currentSkill = hoveredSkill || selectedSkill;
  const currentContent = currentSkill ? skillsContent[currentSkill] : null;

  const skillKeys = useMemo(() => Object.keys(skillsContent), []);

  // debug switch - toggle to false to remove logs
  const DEBUG = true;

  // visibility + measurement
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const [isInViewport, setIsInViewport] = useState(true);
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);
  const [measuredMarqueeHeight, setMeasuredMarqueeHeight] = useState<
    number | null
  >(null);

  // cleanup function for intervals and timeouts
  const cleanupTimers = useCallback(() => {
    if (rotateTimerRef.current) {
      clearTimeout(rotateTimerRef.current);
      rotateTimerRef.current = null;
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current as unknown as NodeJS.Timeout);
      progressTimerRef.current = null;
    }
  }, []);

  const ignoreHoverRef = useRef(false);
  const pausedFromRef = useRef<"auto" | "viewing" | null>(null);
  const modeRef = useRef<typeof mode>(mode);
  // IntersectionObserver runs once and reads the current mode via modeRef to avoid
  // re-creating the observer when `mode` changes (which caused duplicate callbacks
  // and double-restores). prevVisibleRef persists between renders.
  useEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const prevVisibleRef = { current: null as boolean | null };
    const io = new IntersectionObserver(
      (entries) => {
        // choose the best entry (largest intersection ratio) and only act on real changes
        const best = entries.reduce(
          (a, b) => (a.intersectionRatio > b.intersectionRatio ? a : b),
          entries[0],
        );
        const isVisible = best.isIntersecting && best.intersectionRatio > 0;
        const prev = prevVisibleRef.current;
        prevVisibleRef.current = isVisible;

        if (DEBUG)
          console.log(
            "[DEBUG] IntersectionObserver:",
            wrapperRef.current?.id,
            "ratio",
            best.intersectionRatio,
            "isIntersecting",
            best.isIntersecting,
            "mode",
            modeRef.current,
            "pausedFrom",
            pausedFromRef.current,
          );

        // only act when visibility actually changes
        if (prev === isVisible) return;

        // keep public state in sync for rendering placeholder
        setIsInViewport(isVisible);

        if (!isVisible) {
          // went out of view: pause and remember where we were
          if (modeRef.current !== "paused") {
            pausedFromRef.current = modeRef.current;
            if (DEBUG)
              console.log(
                "[DEBUG] IO -> out of view, pausing, pausedFrom",
                pausedFromRef.current,
              );
            setMode("paused");
          }
        } else {
          // came back into view: restore previous mode if it was paused
          if (pausedFromRef.current) {
            const restoreTo = pausedFromRef.current;
            pausedFromRef.current = null;

            // micro-debounce restores to coalesce noisy callbacks (first-time double-restore)
            if (restoreTimerRef.current) {
              clearTimeout(
                restoreTimerRef.current as unknown as NodeJS.Timeout,
              );
              restoreTimerRef.current = null;
            }
            restoreTimerRef.current = setTimeout(() => {
              // only restore if we still aren't paused by some other action
              if (modeRef.current === "paused") {
                if (DEBUG)
                  console.log(
                    "[DEBUG] restoring mode from paused ->",
                    restoreTo,
                  );
                setMode(restoreTo);
              }
              if (restoreTimerRef.current) {
                clearTimeout(
                  restoreTimerRef.current as unknown as NodeJS.Timeout,
                );
                restoreTimerRef.current = null;
              }
            }, 60) as unknown as NodeJS.Timeout;
          }
        }
      },
      { threshold: [0, 0.01, 0.5, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
    // cleanupTimers is stable; do not depend on `mode` so we don't recreate the observer
  }, []);

  // keep modeRef in sync with mode state
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // mode-driven timers
  useEffect(() => {
    cleanupTimers();

    const interval = 100;
    if (DEBUG)
      console.log(
        "[DEBUG] mode effect run ->",
        mode,
        "selectedSkill",
        selectedSkill,
        "savedProgress",
        savedProgressRef.current,
      );

    if (mode === "auto") {
      let currentProgress = savedProgressRef.current ?? 0;
      setProgress(currentProgress);

      const duration = BASE_TIMING * 1000;
      const increment = (interval / duration) * 100;

      const rotateOnce = () => {
        // clear timers
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current as unknown as NodeJS.Timeout);
          progressTimerRef.current = null;
        }
        if (rotateTimerRef.current) {
          clearTimeout(rotateTimerRef.current as unknown as NodeJS.Timeout);
          rotateTimerRef.current = null;
        }

        setSelectedSkill((current) => {
          const idx = current ? skillKeys.indexOf(current) : 0;
          return skillKeys[(idx + 1) % skillKeys.length];
        });
        savedProgressRef.current = 0;
        setProgress(0);
      };

      progressTimerRef.current = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= 100) {
          currentProgress = 100;
          setProgress(100);
          savedProgressRef.current = 100;
          if (DEBUG) console.log("[DEBUG] auto reached 100 -> rotateOnce");
          rotateOnce();
          return;
        }
        setProgress(currentProgress);
        savedProgressRef.current = currentProgress;
      }, interval) as unknown as NodeJS.Timeout;

      rotateTimerRef.current = setTimeout(() => {
        rotateOnce();
      }, duration) as unknown as NodeJS.Timeout;
    } else if (mode === "viewing") {
      if (DEBUG)
        console.log(
          "[DEBUG] viewing start/resume savedProgress",
          savedProgressRef.current,
        );

      const resumeTime = Object.keys(skillsContent).length * BASE_TIMING * 1000;
      const decrement = (interval / resumeTime) * 100;

      const startProgress =
        savedProgressRef.current > 0 && savedProgressRef.current < 100
          ? savedProgressRef.current
          : 100;

      let currentProgress = startProgress;
      setProgress(startProgress);
      savedProgressRef.current = startProgress;

      progressTimerRef.current = setInterval(() => {
        currentProgress -= decrement;
        if (currentProgress <= 0) {
          currentProgress = 0;
          setProgress(0);
          savedProgressRef.current = 0;
          if (DEBUG) console.log("[DEBUG] viewing complete -> auto");
          setMode("auto");
          return;
        }
        setProgress(currentProgress);
        savedProgressRef.current = currentProgress;
      }, interval) as unknown as NodeJS.Timeout;
    } else if (mode === "paused") {
      // paused: do nothing (timers are already cleared)
    }

    return cleanupTimers;
  }, [mode, selectedSkill, cleanupTimers, skillKeys]);

  // measure content height so we can render a placeholder of the same size
  // Measure when visible, and capture final measurement before going out of view
  useEffect(() => {
    if (!isInViewport) return; // only measure when visible
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) {
        setMeasuredHeight(h);
        if (DEBUG) console.log("[DEBUG] measuredHeight updated:", h);
      }
    };

    // initial measurement
    measure();

    const ro = new ResizeObserver(() => {
      measure();
    });
    ro.observe(el);

    return () => {
      // take final measurement before cleanup
      measure();
      ro.disconnect();
    };
  }, [isInViewport]);

  // measure marquee height separately so the top section's placeholder can use an
  // accurate height rather than the content panel's height
  useEffect(() => {
    if (!isInViewport) return; // only measure when visible
    const el = marqueeRef.current;
    if (!el) return;

    const measure = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) {
        setMeasuredMarqueeHeight(h);
        if (DEBUG) console.log("[DEBUG] measuredMarqueeHeight updated:", h);
      }
    };

    // initial measurement
    measure();

    const ro = new ResizeObserver(() => {
      measure();
    });
    ro.observe(el);

    return () => {
      // take final measurement before cleanup
      measure();
      ro.disconnect();
    };
  }, [isInViewport]);

  // (IntersectionObserver handled above; avoid a second observer to prevent duplicate callbacks)

  const handleSkillClick = useCallback(
    (id: string) => {
      // if clicking the currently selected skill while we're viewing (or paused-from-viewing),
      // treat it as a cancel (return to auto) instead of restarting the viewing countdown.
      // ...
      // if user clicks the currently selected skill while not in auto mode,
      // treat this as a cancel of the viewing session and return to auto.

      if (id === selectedSkill && mode !== "auto") {
        // cancel viewing
        cleanupTimers();
        savedProgressRef.current = 0;
        setProgress(0);
        pausedFromRef.current = null;
        setHoveredSkill(null);
        setMode("auto");
        return;
      }

      setSelectedSkill(id);
      setHoveredSkill(null);

      cleanupTimers();

      savedProgressRef.current = 100;
      setProgress(100);

      ignoreHoverRef.current = true;
      setTimeout(() => {
        ignoreHoverRef.current = false;
      }, 150);
      savedProgressRef.current = 100;
      setProgress(100);
      setMode("viewing");
    },
    [cleanupTimers, mode, selectedSkill],
  );

  const MarqueeButton = useCallback(
    ({
      id,
      children,
      className,
    }: {
      id: string;
      children: string;
      className?: string;
    }) => {
      return (
        <button
          type="button"
          onMouseEnter={() => {
            if (!ignoreHoverRef.current && hoveredSkill !== id) {
              setHoveredSkill(id);
              if (mode === "auto" || mode === "viewing") {
                pausedFromRef.current = mode;
                setMode("paused");
              }
            }
          }}
          onMouseLeave={() => {
            if (hoveredSkill === id) {
              setHoveredSkill(null);

              // restore previous mode if we paused due to hover
              if (mode === "paused") {
                const prev = pausedFromRef.current;
                pausedFromRef.current = null;
                if (prev) setMode(prev);
                else setMode("auto");
              }
            }
          }}
          onClick={() => handleSkillClick(id)}
          className={cn(
            "cursor-pointer bg-background px-2 transition duration-300",
            selectedSkill === id
              ? "bg-foreground text-background"
              : "hover:bg-foreground/80 hover:text-background",
            className,
          )}
        >
          {children}
        </button>
      );
    },
    [hoveredSkill, selectedSkill, handleSkillClick, mode],
  );

  return (
    <main ref={wrapperRef}>
      <section className="w-full border-separator/10 border-t">
        <div className="inner relative flex h-full flex-col border-separator/10 border-x py-1">
          {!isInViewport ? (
            // render a placeholder of the same measured height to avoid layout shift while the
            // heavy content is offscreen. keep the last measured height if available.
            <div
              aria-hidden="true"
              style={{ height: measuredMarqueeHeight ?? 80 }}
              className="w-full"
            />
          ) : (
            <>
              <div ref={marqueeRef}>
                <Marquee
                  className="mx-1 font-medium font-montreal text-xl md:text-2xl lg:text-3xl [&>*>button]:mx-1"
                  style={
                    {
                      "--duration": `${Object.keys(skillsContent).length * BASE_TIMING}s`,
                    } as React.CSSProperties
                  }
                >
                  {Object.keys(skillsContent).map((key, _idx) => {
                    let star: React.ReactNode;
                    switch (key) {
                      case "frontend":
                        star = (
                          <Star15
                            size={32}
                            className="my-auto size-6 sm:size-8"
                          />
                        );
                        break;
                      case "backend":
                        star = (
                          <Star12
                            size={32}
                            className="my-auto size-6 sm:size-8"
                          />
                        );
                        break;
                      case "graphic":
                        star = (
                          <Star28
                            size={32}
                            className="my-auto size-6 sm:size-8"
                          />
                        );
                        break;
                      case "uiux":
                        star = (
                          <Star40
                            size={32}
                            className="my-auto size-6 sm:size-8"
                          />
                        );
                        break;
                      case "mobile":
                        star = (
                          <Star3
                            size={32}
                            className="my-auto size-6 sm:size-8"
                          />
                        );
                        break;
                      default:
                        star = null;
                    }

                    return (
                      <Fragment key={key}>
                        <MarqueeButton id={key}>
                          {skillsContent[key].title}
                        </MarqueeButton>
                        {star}
                      </Fragment>
                    );
                  })}
                </Marquee>
              </div>

              <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
              <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-1/4 bg-gradient-to-l from-background"></div>

              <PlusSeparator position={["top-left", "top-right"]} />
            </>
          )}
        </div>
      </section>
      <section className="w-full border-separator/10 border-t">
        <div className="inner relative flex h-full flex-col border-separator/10 border-x">
          {!isInViewport ? (
            // render a placeholder of the same measured height to avoid layout shift while the
            // heavy content is offscreen. keep the last measured height if available.
            <div
              aria-hidden="true"
              style={{ height: measuredHeight ?? 300 }}
              className="w-full"
            />
          ) : (
            <>
              {/* Animated Skills Content */}
              <div
                ref={contentRef}
                className="relative h-full min-h-[300px] overflow-hidden px-4 py-8 pt-12 md:px-8 lg:px-16"
              >
                <AnimatePresence mode="wait">
                  {currentContent && (
                    <motion.div
                      key={currentSkill}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex flex-col items-center gap-6 text-center"
                    >
                      <motion.h3
                        className="font-bold font-montreal text-3xl md:text-4xl lg:text-5xl"
                        layout
                      >
                        {currentContent.title}
                      </motion.h3>

                      <motion.div
                        className="max-w-3xl text-sm md:text-base lg:text-lg"
                        layout
                      >
                        {currentContent.element}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="pointer-events-none absolute bottom-0 left-0 h-14 w-1/8 min-w-18 bg-muted-foreground blur-[150px]"></div>
                <div className="pointer-events-none absolute right-0 bottom-0 h-14 w-1/8 min-w-18 bg-muted-foreground blur-[150px]"></div>
              </div>

              {/* Progress Bar - Bottom Right */}
              <div className="absolute right-4 bottom-4 z-10">
                <div className="flex flex-col items-end gap-1">
                  {/* render state (debug logs via effect) */}
                  <span className="min-w-[90px] text-right text-2xs text-muted-foreground tabular-nums">
                    {mode === "viewing" ||
                    (mode === "paused" && pausedFromRef.current === "viewing")
                      ? hoveredSkill
                        ? "Viewing (paused)"
                        : "Viewing"
                      : hoveredSkill
                        ? "Auto-rotating (paused)"
                        : "Auto-rotating"}
                  </span>
                  <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full transition-colors duration-200",
                        mode === "auto" && !hoveredSkill
                          ? "bg-foreground"
                          : "bg-muted-foreground",
                      )}
                      style={{
                        width: `${progress}%`,
                        transition: "none",
                      }}
                    />
                  </div>
                </div>
              </div>

              <PlusSeparator position={["top-left", "top-right"]} />
            </>
          )}
        </div>
      </section>
    </main>
  );
}
