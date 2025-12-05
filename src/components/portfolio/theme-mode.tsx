"use client";
import { useThemeStore } from "@/lib/store/site-theme";
import Snowfall from "react-snowfall";

export function ThemeMode() {
  const { modes, currentModeIndex } = useThemeStore();
  const currentMode = modes[currentModeIndex];

  return currentMode === "snowfall" ? (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <Snowfall />
    </div>
  ) : null;
}
