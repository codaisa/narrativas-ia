"use server";

import { z } from "zod";
import { promptSchema } from "../_common";

export interface IMainForm {
  fields?: {
    prompt?: string[];
  };
  message?: string;
  status?: string;
}

export const submitInitialPrompt = async (_: IMainForm, formData: FormData) => {
  const schema = z.object({
    prompt: promptSchema,
  });
  const parse = schema.safeParse(Object.fromEntries(formData.entries()));
  console.log(formData);

  if (!parse.success) {
    return {
      fields: parse.error.flatten().fieldErrors,
      status: "error",
    };
  }

  return {
    message: parse.data.prompt,
    status: "success",
  };
};
