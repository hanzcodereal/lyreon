import { create } from "zustand";
import type { Track, RepeatMode } from "@/types";

interface PlayerState {
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  progressSec: number;
  volume: number;
  repeat: RepeatMode;
  shuffle: boolean;

  current: () => Track | undefined;
  playQueue: (tracks: Track[], startIndex?: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (sec: number) => void;
  setProgress: (sec: number) => void;
  setVolume: (v: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  addToQueue: (track: Track) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  progressSec: 0,
  volume: 0.85,
  repeat: "off",
  shuffle: false,

  current: () => {
    const { queue, currentIndex } = get();
    return currentIndex >= 0 ? queue[currentIndex] : undefined;
  },

  playQueue: (tracks, startIndex = 0) => {
    set({ queue: tracks, currentIndex: startIndex, isPlaying: true, progressSec: 0 });
  },

  togglePlay: () => set((s) => ({ isPlaying: s.queue.length ? !s.isPlaying : false })),

  next: () => {
    const { queue, currentIndex, repeat, shuffle } = get();
    if (!queue.length) return;
    let nextIndex: number;
    if (repeat === "one") {
      nextIndex = currentIndex;
    } else if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (currentIndex >= queue.length - 1) {
      nextIndex = repeat === "all" ? 0 : currentIndex;
    } else {
      nextIndex = currentIndex + 1;
    }
    set({ currentIndex: nextIndex, progressSec: 0, isPlaying: true });
  },

  prev: () => {
    const { currentIndex } = get();
    set({ currentIndex: Math.max(0, currentIndex - 1), progressSec: 0 });
  },

  seek: (sec) => set({ progressSec: sec }),
  setProgress: (sec) => set({ progressSec: sec }),
  setVolume: (v) => set({ volume: Math.min(1, Math.max(0, v)) }),
  toggleRepeat: () =>
    set((s) => ({
      repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off",
    })),
  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
  addToQueue: (track) => set((s) => ({ queue: [...s.queue, track] })),
}));
  
