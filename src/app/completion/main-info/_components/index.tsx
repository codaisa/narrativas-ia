"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useActionState, useEffect, useState } from "react";
import { submitInitialPrompt } from "../_actions";
import { useRouter } from "next/navigation";
import { INITIAL_MAIN_FORM_STATE } from "../_common";
import { useStore } from "@/stores/useStore";
import { Switch } from "@/components/ui/switch";

const MainForm: React.FC = () => {
  const router = useRouter();
  const [autoGenerate, setAutoGenerate] = useState(false);
  const setPrompt = useStore((state) => state.setPrompt);
  const [formState, action] = useActionState(
    submitInitialPrompt,
    INITIAL_MAIN_FORM_STATE
  );

  useEffect(() => {
    if (formState.status === "success" && formState?.message) {
      setPrompt({
        autoGenerate,
        data: formState?.message,
      });
      router.push("/completion/brainstorm");
    }
  }, [formState]);

  return (
    <form action={action} className="flex gap-2 justify-end flex-col w-full ">
      <Textarea
        id="prompt"
        name="prompt"
        className="mt-4 h-[150px] w-full"
        placeholder="Descreva uma visão geral da sua narrativa, detalhando com o máximo de contexto possível"
      />

      {formState.fields?.prompt && formState.status === "error" && (
        <span className="text-sm text-red-500">
          {formState.fields?.prompt[0]}
        </span>
      )}

      <div className="w-full flex gap-2 items-center justify-start">
        <Switch
          checked={autoGenerate}
          onClick={() => setAutoGenerate((p) => !p)}
        />

        <span>Solicitar criação automática</span>
      </div>

      <Button className="mt-4">Criar brainstorm</Button>
    </form>
  );
};

export default MainForm;
