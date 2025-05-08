"use client";

import { useStore } from "@/stores/useStore";
import React, { useActionState, useEffect, useState } from "react";
import { scamperQuestions } from "../_common";
import BrainBox from "./BrainBox";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Warning } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { createNarrativeAction, CreateNarrativeResult } from "./BrainBox/_actions/createNarrative";


const BrainstormBody = () => {
  const prompt = useStore((state) => state.prompt);
  const narrative = useStore(state => state.narrative);
  const [isCreating, setIsCreating] = useState(false)

  const brainstorm = useStore(state => state.brainstorm)

  const [formState, action] = useActionState<CreateNarrativeResult, FormData>(
    createNarrativeAction,
    { status: "idle" }
  );

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setIsCreating(false);
    if (formState.status === "success") {
      setShowModal(true)
    }
  }, [formState.status]);

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
        <input type={"hidden"} name={"brainstormData"} value={JSON.stringify(brainstorm || {})} />
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

        {showModal && formState.status === "success" && formState.url && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4 text-center">
                Narrativa pronta!
              </h2>
              <p className="mb-6 text-center">
                Sua narrativa foi gerada com sucesso. Clique abaixo para
                abrir o documento:
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="default"
                  onClick={() => {
                    window.open(formState.url, "_blank")
                    setShowModal(false)
                  }}
                >
                  Abrir documento
                </Button>
                <Button variant="ghost" onClick={() => setShowModal(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        )}

      </form>
    </AnimatePresence>
  );
};

export default BrainstormBody;
