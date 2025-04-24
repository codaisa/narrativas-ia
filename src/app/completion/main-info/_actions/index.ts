"use server";

import { formSchema } from "../_common";

export interface IMainForm {
  fields?: {
    title?: string[];
    tipo?: string[];
    diretoria?: string[];
    prompt?: string[];
    autoGenerate?: string[];
  };
  message?: {
    title: string;
    tipo: string;
    diretoria: string;
    prompt: string;
    autoGenerate: boolean;
  };
  status?: string;
}

export const submitInitialPrompt = async (_prevState: IMainForm, formData: FormData): Promise<IMainForm> => {
  const data = Object.fromEntries(formData.entries())
  const parsed = formSchema.safeParse({
    title: data.title,
    tipo: data.tipo,
    diretoria: data.diretoria,
    prompt: data.prompt,
    autoGenerate: data.autoGenerate,
  });

  if (!parsed.success) {
    return {
      fields: parsed.error.flatten().fieldErrors,
      status: "error",
    };
  }

  return {
    message: parsed.data,
    status: "success",
  };
};
