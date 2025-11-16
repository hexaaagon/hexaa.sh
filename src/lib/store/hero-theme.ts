import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "contour" | "blackhole";

interface ThemeState {
  themes: Theme[];
  currentThemeIndex: number;
  cycleTheme: () => void;
  setThemes: (newThemes: Theme[]) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themes: ["contour", "blackhole"],
      currentThemeIndex: 0,
      cycleTheme: () => {
        const { currentThemeIndex, themes } = get();
        const nextIndex = (currentThemeIndex + 1) % themes.length;
        set({ currentThemeIndex: nextIndex });
      },
      setThemes: (newThemes) => {
        set({ themes: newThemes, currentThemeIndex: 0 });
      },
    }),
    {
      name: "theme-storage",
    },
  ),
);
