import { ScamperEnum } from "@/enums/scamper.enum";
import { StateCreator } from "zustand";

export type IScamperData = {
  [X in ScamperEnum]: string;
};

export interface IPromptSlice {
  prompt?: {
    autoGenerate: boolean;
    data: string;
  };
  setPrompt: (prompt: { autoGenerate: boolean; data: string }) => void;

  brainstorm?: IScamperData;
  setBrainstorm: (prompt: IScamperData) => void;
}

export const createPromptSlice: StateCreator<
  IPromptSlice,
  [],
  [],
  IPromptSlice
> = (set) => ({
  prompt: undefined,
  setPrompt: (prompt) => set({ prompt }),

  brainstorm: {} as IScamperData,
  setBrainstorm: (brainstorm) => set({ brainstorm }),
});
