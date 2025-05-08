import { IMainForm } from "../_actions";
import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(1),
  tipo: z.string().min(1),
  diretoria: z.string().min(1),
  prompt: z.string().min(1),
  autoGenerate: z.coerce.boolean(),
});

export type FormDataType = z.infer<typeof formSchema>;

export const INITIAL_MAIN_FORM_STATE: IMainForm = {
  fields: undefined,
  message: undefined,
  status: undefined,
};

export const narrativas = [
  {
    id: "6paginas",
    label: "6 Páginas",
  },
  {
    id: "coe",
    label: "Correção de erros (CoE)",
  },
  {
    id: "iniciativa",
    label: "Iniciativa",
  },
  {
    id: "anatomia",
    label: "Anatomia de iniciativa",
  },
];

export const diretorias = [
  {
    id: "comercial",
    label: "Comercial",
  },
  {
    id: "presidencia",
    label: "Presidência",
  },
  {
    id: "supply",
    label: "Supply e Marketing",
  },
  {
    id: "gente",
    label: "Gente",
  },

  {
    id: "industrial",
    label: "Industrial e Administrativo",
  },
  {
    id: "financeiro",
    label: "Financeiro",
  },
];
