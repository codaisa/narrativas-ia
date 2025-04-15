"use client";

import { useStore } from "@/stores/useStore";
import React from "react";
import { scamperQuestions } from "../_common";
import BrainBox from "./BrainBox";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Warning } from "@phosphor-icons/react/dist/ssr";

const BrainstormBody = () => {
  const prompt = useStore((state) => state.prompt);

  return (
    <AnimatePresence>
      <div className="w-full h-full flex flex-col items-start">
        <span className="mb-4">
          <b>Prompt base:</b> {prompt?.data}
        </span>

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
      </div>
    </AnimatePresence>
  );
};

export default BrainstormBody;
