"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import { type JSX, useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Position {
  x: number;
  y: number;
}

export interface SmoothCursorProps {
  cursor?: ({
    cursorType,
    isOverPointer,
  }: {
    cursorType: "default" | "text" | "pointer";
    isOverPointer: boolean;
  }) => JSX.Element;
  disableRotation?: boolean;
  disableSmooth?: boolean;
  cursorType?: "default" | "text" | "pointer";
}

export function SmoothCursor({
  cursor: Cursor,
  disableRotation = false,
  disableSmooth = false,
  cursorType = "default",
}: SmoothCursorProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  const [hasMoved, setHasMoved] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isOverPointer, setIsOverPointer] = useState(false);
  const [isOverPrevent, setIsOverPrevent] = useState(false);
  const lastMousePos = useRef<Position>({ x: 0, y: 0 });
  const velocity = useRef<Position>({ x: 0, y: 0 });
  const lastUpdateTime = useRef(Date.now());
  const previousAngle = useRef(-45);
  const accumulatedRotation = useRef(-45);
  const movingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Much more responsive cursor tracking - minimal lag
  const cursorX = useSpring(0, {
    stiffness: disableSmooth ? 10000 : 1200,
    damping: disableSmooth ? 100 : 80,
    mass: disableSmooth ? 0.1 : 0.3,
  });
  const cursorY = useSpring(0, {
    stiffness: disableSmooth ? 10000 : 1200,
    damping: disableSmooth ? 100 : 80,
    mass: disableSmooth ? 0.1 : 0.3,
  });
  const rotation = useSpring(-45, {
    stiffness: 800,
    damping: 60,
    mass: 0.4,
  });
  const scale = useSpring(1, {
    stiffness: 1000,
    damping: 70,
    mass: 0.3,
  });

  useEffect(() => {
    if (isMobile) return;

    const updateVelocity = (currentPos: Position) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTime.current;

      if (deltaTime > 0) {
        velocity.current = {
          x: (currentPos.x - lastMousePos.current.x) / deltaTime,
          y: (currentPos.y - lastMousePos.current.y) / deltaTime,
        };
      }

      lastUpdateTime.current = currentTime;
      lastMousePos.current = currentPos;
    };

    const checkIfOverElement = (e: MouseEvent) => {
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        const isPointerElement =
          element.closest("a, button") !== null ||
          window.getComputedStyle(element).cursor === "pointer";
        setIsOverPointer(isPointerElement);

        const isPreventElement =
          element.closest("[data-smoothcursor-prevent]") !== null;
        setIsOverPrevent(isPreventElement);
      }
    };

    const smoothMouseMove = (e: MouseEvent) => {
      const currentPos = { x: e.clientX, y: e.clientY };
      updateVelocity(currentPos);
      checkIfOverElement(e);

      const speed = Math.sqrt(
        velocity.current.x ** 2 + velocity.current.y ** 2,
      );

      cursorX.set(currentPos.x);
      cursorY.set(currentPos.y);

      if (speed > 0.1) {
        if (!disableRotation && !prefersReducedMotion) {
          const currentAngle =
            Math.atan2(velocity.current.y, velocity.current.x) *
              (180 / Math.PI) +
            90;

          let angleDiff = currentAngle - previousAngle.current;
          if (angleDiff > 180) angleDiff -= 360;
          if (angleDiff < -180) angleDiff += 360;
          accumulatedRotation.current += angleDiff;
          rotation.set(accumulatedRotation.current);
          previousAngle.current = currentAngle;
        }

        // Faster scale feedback
        scale.set(prefersReducedMotion ? 1 : 0.99);
        setHasMoved(true);
        setIsMoving(true);

        // Clear previous timeout if it exists
        if (movingTimeoutRef.current) {
          clearTimeout(movingTimeoutRef.current);
        }

        // Set new timeout to mark as not moving
        movingTimeoutRef.current = setTimeout(
          () => {
            scale.set(1);
            setIsMoving(false);
            movingTimeoutRef.current = null;
          },
          prefersReducedMotion ? 0 : 500, // 1 second timeout when cursor stops
        );
      }
    };

    let rafId: number;
    const throttledMouseMove = (e: MouseEvent) => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        smoothMouseMove(e);
        rafId = 0;
      });
    };

    window.addEventListener("mousemove", throttledMouseMove);

    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
      // Clean up moving timeout on unmount
      if (movingTimeoutRef.current) {
        clearTimeout(movingTimeoutRef.current);
      }
    };
  }, [
    cursorX,
    cursorY,
    rotation,
    scale,
    disableRotation,
    isMobile,
    prefersReducedMotion,
  ]);

  if (isMobile || !hasMoved || isOverPrevent) {
    return null;
  }

  return (
    <motion.div
      className={`pointer-events-none fixed z-99999 translate-x-[-50%] translate-y-[-50%] mix-blend-exclusion transition-[scale,opacity] ${isMoving || cursorType === "pointer" || isOverPointer ? "scale-100 opacity-100 duration-300" : "scale-200 opacity-0 duration-700"}`}
      style={{
        left: cursorX,
        top: cursorY,
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        willChange: "transform",
      }}
    >
      {Cursor ? (
        <Cursor cursorType={cursorType} isOverPointer={isOverPointer} />
      ) : (
        <>
          <div className="absolute h-[34px] w-[34px] dark:bg-white dark:blur-[7rem]"></div>
          <div
            style={{
              opacity: cursorType === "pointer" || isOverPointer ? 1 : 0,
              scale: cursorType === "pointer" || isOverPointer ? 1.2 : 1,
            }}
            className={`pointer-events-none h-[34px] w-[34px] rounded-full border-2 bg-white shadow-sm transition-all duration-300 ease-out will-change-transform`}
          ></div>
          <div
            style={{
              opacity: !isOverPointer ? 1 : 0,
            }}
            className={`pointer-events-none absolute top-0 left-0 h-[34px] w-[34px] rounded-full border-2 shadow-sm drop-shadow-sm transition-all duration-300 ease-out will-change-transform dark:border-gray-700 ${disableRotation ? "-rotate-45" : ""}`}
          ></div>
        </>
      )}
    </motion.div>
  );
}
