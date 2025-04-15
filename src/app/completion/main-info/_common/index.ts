import { IMainForm } from "../_actions";
import { z } from "zod";

export const promptSchema = z
  .string()
  .trim()
  .min(1, { message: "Campo obrigatório" });

export const INITIAL_MAIN_FORM_STATE: IMainForm = {
  fields: undefined,
  message: undefined,
  status: undefined,
};
