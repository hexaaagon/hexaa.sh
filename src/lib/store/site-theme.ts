import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "normal" | "snowfall";

interface ThemeState {
  modes: Theme[];
  currentModeIndex: number;
  cycleMode: () => void;
  setMode: (newThemes: Theme[]) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      modes: ["normal", "snowfall"],
      currentModeIndex: 0,
      cycleMode: () => {
        const { currentModeIndex: currentThemeIndex, modes: themes } = get();
        const nextIndex = (currentThemeIndex + 1) % themes.length;
        set({ currentModeIndex: nextIndex });
      },
      setMode: (newThemes) => {
        set({ modes: newThemes, currentModeIndex: 0 });
      },
    }),
    {
      name: "theme-storage",
    },
  ),
);
