import { create } from "zustand";

type SolarState = {
  paused: boolean;
  speed: number;
  selectedId: string | null;
  focusedId: string | null;
  showLabels: boolean;
  showOrbits: boolean;
  showTrails: boolean;
  elapsed: number;
  togglePause: () => void;
  setPaused: (paused: boolean) => void;
  setSpeed: (speed: number) => void;
  select: (id: string | null) => void;
  focus: (id: string | null) => void;
  resetView: () => void;
  setShowLabels: (value: boolean) => void;
  setShowOrbits: (value: boolean) => void;
  setShowTrails: (value: boolean) => void;
  setElapsed: (elapsed: number) => void;
};

export const useSolar = create<SolarState>((set) => ({
  paused: false,
  speed: 1,
  selectedId: "earth",
  focusedId: null,
  showLabels: true,
  showOrbits: true,
  showTrails: true,
  elapsed: 0,
  togglePause: () => set((s) => ({ paused: !s.paused })),
  setPaused: (paused) => set({ paused }),
  setSpeed: (speed) => set({ speed }),
  select: (id) => set({ selectedId: id }),
  focus: (id) => set(id ? { focusedId: id, selectedId: id } : { focusedId: null }),
  resetView: () => set({ focusedId: null }),
  setShowLabels: (showLabels) => set({ showLabels }),
  setShowOrbits: (showOrbits) => set({ showOrbits }),
  setShowTrails: (showTrails) => set({ showTrails }),
  setElapsed: (elapsed) => set({ elapsed }),
}));
