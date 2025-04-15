import { create } from "zustand";
import { createPromptSlice, IPromptSlice } from "./slices/prompt.slice";

export const useStore = create<IPromptSlice>()((...a) => ({
  ...createPromptSlice(...a),
}));
