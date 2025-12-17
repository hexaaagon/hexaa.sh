import { create } from "zustand";

interface MapSelectionState {
  selectedLine: string | null;
  setSelectedLine: (lineId: string | null) => void;
}

export const useMapSelection = create<MapSelectionState>((set) => ({
  selectedLine: null,
  setSelectedLine: (lineId) => set({ selectedLine: lineId }),
}));
