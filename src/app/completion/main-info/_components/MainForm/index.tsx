"use client";

import React, { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/stores/useStore";
import { submitInitialPrompt } from "../../_actions";
import { INITIAL_MAIN_FORM_STATE } from "../../_common";

import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import { narrativas, diretorias } from "../../_common";

export default function MainForm() {
  const router = useRouter();
  const setPrompt = useStore(s => s.setPrompt);
  const setNarrative = useStore(s => s.setNarrative);

  const [autoGenerate, setAutoGenerate] = useState(false);
  const [formState, action] = useActionState(submitInitialPrompt, INITIAL_MAIN_FORM_STATE);

  useEffect(() => {
    if (formState.status === "success" && formState.message) {
      const { title, tipo, diretoria, prompt, autoGenerate } = formState.message;
      setNarrative({ title, tipo, diretoria });
      setPrompt({ autoGenerate, data: prompt });
      router.push("/completion/brainstorm");
    }
  }, [formState, autoGenerate, setPrompt, setNarrative, router]);

  return (
    <form action={action} className="flex flex-col w-full gap-6">
      <fieldset>
        <legend className="text-md font-semibold">1. Defina sua narrativa</legend>
        <div className="mt-2 flex flex-col gap-2">
          <Input
            name="title"
            placeholder="Título"
            className="w-full"
          />

          <div className="flex gap-2">
            <Select name="tipo" defaultValue="">
              <SelectTrigger className="w-full"><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Narrativas</SelectLabel>
                  {narrativas.map(n => (
                    <SelectItem key={n.id} value={n.id}>{n.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select name="diretoria" defaultValue="">
              <SelectTrigger className="w-full"><SelectValue placeholder="Diretoria" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Diretorias</SelectLabel>
                  {diretorias.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-md font-semibold">2. Crie contexto</legend>
        <div className="mt-2 flex flex-col gap-2">
          <Textarea
            name="prompt"
            className="h-[150px] w-full"
            placeholder="Descreva uma visão geral da sua narrativa…"
          />
          {formState.fields?.prompt && formState.status === "error" && (
            <span className="text-sm text-red-500">{formState.fields.prompt[0]}</span>
          )}
          <label className="flex items-center gap-2">
            <Switch
              name="autoGenerate"
              checked={autoGenerate}
              onCheckedChange={setAutoGenerate}
            />
            <span>Solicitar criação automática</span>
          </label>
        </div>
      </fieldset>

      <Button type="submit" className="self-end">
        Criar brainstorm
      </Button>
    </form>
  );
}
