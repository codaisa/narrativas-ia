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

  narrative?: { title: string, tipo: string, diretoria: string }
  setNarrative: (n: { title: string, tipo: string, diretoria: string }) => void

  brainstorm?: IScamperData;
  setBrainstorm: (b: IScamperData) => void;
}

export const createPromptSlice: StateCreator<
  IPromptSlice
// [],
// [],
// IPromptSlice
> = (set) => ({
  prompt: undefined,
  setPrompt: (prompt) => set({ prompt }),

  narrative: undefined,
  setNarrative: (narrative) => set({ narrative }),

  brainstorm: {} as IScamperData,
  setBrainstorm: (brainstorm) => set({ brainstorm }),
});
