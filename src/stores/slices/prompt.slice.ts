import { StateCreator } from "zustand";

export interface IPromptSlice {
  prompt?: {
    autoGenerate: boolean;
    data: string;
  };
  setPrompt: (prompt: { autoGenerate: boolean; data: string }) => void;
}

export const createPromptSlice: StateCreator<
  IPromptSlice,
  [],
  [],
  IPromptSlice
> = (set) => ({
  prompt: undefined,
  setPrompt: (prompt) => set({ prompt }),
});
