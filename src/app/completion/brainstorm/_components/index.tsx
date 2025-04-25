"use client";

import { useStore } from "@/stores/useStore";
import React, { useActionState, useEffect, useState } from "react";
import { scamperQuestions } from "../_common";
import BrainBox from "./BrainBox";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Warning } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { createNarrativeAction, CreateNarrativeResult } from "@/app/actions/createNarrative";

const BrainstormBody = () => {
  const prompt = useStore((state) => state.prompt);
  const narrative = useStore(state => state.narrative);
  const [isCreating, setIsCreating] = useState(false)

  // 1) Configura a action com useActionState
  const [formState, action] = useActionState<CreateNarrativeResult, FormData>(
    createNarrativeAction,
    { status: "idle" }
  );

  // 2) Quando a action terminar, desliga o isCreating
  useEffect(() => {
    if (formState.status === "success" || formState.status === "error") {
      setIsCreating(false);
    }
  }, [formState.status]);

  // 3) Ao submeter, liga o isCreating e deixa a action rodar
  const handleSubmit = () => {
    setIsCreating(true);
  };

  return (
    <AnimatePresence>
      <form
        action={action}
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-start"
      >
        <div className="flex flex-col flex-wrap items-start gap-y-1 mb-4">
          <span >
            <b>Prompt base:</b> {prompt?.data}
          </span>
          <span>
            <b>Título:</b> {narrative?.title}
          </span>
          <span>
            <b>Tipo:</b> {narrative?.tipo}
          </span>
          <span>
            <b>Diretoria:</b> {narrative?.diretoria}
          </span>
        </div>

        <Alert className="mb-4">
          <Warning className="h-4 w-4" />
          <AlertTitle>Atenção na geração!</AlertTitle>
          <AlertDescription>
            Nessa etapa seu dever é selecionar as respostas ideais para sua
            narrativa. Lembre-se sempre do motivo principal.
          </AlertDescription>
        </Alert>

        <motion.div className="w-full h-full grid md:grid-cols-3 grid-cols-1 gap-4">
          {scamperQuestions.map((question, index) => (
            <motion.div
              key={question.label.toString()}
              transition={{
                delay: 0.1 * index,
              }}
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.98,
              }}
            >
              <BrainBox
                data={question}
                prompt={prompt?.data}
                autoGenerate={prompt?.autoGenerate}
              />
            </motion.div>
          ))}
        </motion.div>

        <input type="hidden" name="docId" value={process.env.NEXT_PUBLIC_TEMPLATE_DOC_6PAGINAS_ID} />
        <input
          type="hidden"
          name="systemPromptBase"
          value={`Voce está trabalhando na metodologia SCAMPER com base nesta ideia: ${prompt?.data}`}
        />
        <input
          type="hidden"
          name="userPromptBase"
          value={`Base: ${prompt?.data}`}
        />
        <input
          type="hidden"
          name="title"
          value={narrative?.title}
        />
        <input
          type="hidden"
          name="tipo"
          value={narrative?.tipo}
        />
        <input type="hidden"
          name="diretoria"
          value={narrative?.diretoria}
        />

        <div className="w-full flex justify-center mb-2 mt-20 ">
          <Button type="submit" disabled={isCreating}>
            {isCreating ? (
              <span className="flex items-center">
                Gerando
                <span className="ml-2 inline-block w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin" />
              </span>
            ) : (
              "Criar narrativa completa"
            )}
          </Button>
        </div>

        {formState.status === "success" && formState.url && (
          <div className="my-10 text-center flex justify-center w-full ">
            <div className="text-center w-1/3 bg-green-500 py-1 px-2 rounded-md hover:brightness-95">
              <span className="mr-2 text-white">Sua narrativa está pronta:</span>
              <a
                href={formState.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black-600 underline"
              >
                Abrir documento
              </a>
            </div>
          </div>
        )}

      </form>
    </AnimatePresence>
  );
};

export default BrainstormBody;
