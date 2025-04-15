"use client";

import React, { useCallback, useEffect, useState } from "react";
import { scamperQuestions } from "../../_common";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Question } from "@phosphor-icons/react/dist/ssr";
import * as Tabs from "./Tabs";
import { cn } from "@/lib/utils";
import { useCompletion } from "@ai-sdk/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useStore } from "@/stores/useStore";
import { IScamperData } from "@/stores/slices/prompt.slice";
import { motion, AnimatePresence } from "framer-motion";

export type Props = {
  data: (typeof scamperQuestions)[0];
  prompt?: string;
  autoGenerate?: boolean;
};

const tabs = ["Feedback"];

const BrainBox: React.FC<Props> = ({ data, prompt, autoGenerate }) => {
  const SYSTEM_PROMPT = `Voce está trabalhando na metodologia SCAMPER. com base nesta ideia: ${prompt}. Voce receberá do usuário um questionamento do usuário a respeito de um dos métodos do scamper, ajude a pensar com base na ideia. Seja acertivo, não cite o método scamper. não faça perguntas somente responda.`;
  const USER_PROMPT = `método: ${data.title} /n/n base: ${data.description}`;
  const TEMPERATURE = 10;

  const brainstorm = useStore((state) => state.brainstorm);
  const setBrainstorm = useStore((state) => state.setBrainstorm);

  const [params, setParams] = useState({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: USER_PROMPT,
    temperature: 10,
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(params.systemPrompt);
  const [temperature, setTemperature] = useState(params.temperature);
  const [userPrompt, setUserPrompt] = useState(params.userPrompt);

  const handleSetupSettings = () => {
    setSystemPrompt(SYSTEM_PROMPT);
    setTemperature(TEMPERATURE);
    setUserPrompt(USER_PROMPT);
  };

  const handleSaveSettings = () => {
    setParams({
      systemPrompt: systemPrompt,
      temperature: temperature,
      userPrompt: userPrompt,
    });

    setSettingsOpen(false);
  };

  const handleCloseSettings = () => {
    setSystemPrompt(params.systemPrompt);
    setTemperature(params.temperature);
    setUserPrompt(params.userPrompt);

    setSettingsOpen(false);
  };

  const [tab, setTab] = useState(0);
  const { completion, handleSubmit, isLoading } = useCompletion({
    body: {
      prompt: params.userPrompt,
      system: params.systemPrompt,
      temperature: params.temperature / 100,
    },
    initialInput: "clean_data",
    api: "/api/completion",
  });

  useEffect(() => {
    setFeedback(completion);
  }, [completion]);

  const [feedback, setFeedback] = useState(completion);

  const isSaved = brainstorm && brainstorm[data.id];

  const handleSaveBrainstorm = () => {
    setBrainstorm({ ...(brainstorm as IScamperData), [data.id]: feedback });
  };

  const handleGeneratePrompt = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  useEffect(() => {
    if (autoGenerate) {
      handleGeneratePrompt();
    }
  }, [autoGenerate, handleGeneratePrompt]);

  const Tab = Tabs[Object.keys(Tabs)[tab]];

  return (
    <TooltipProvider>
      <div className="flex px-2 h-full py-1 flex-col w-full border-[1px] rounded-md border-gray-300">
        <div className=" flex items-start flex-col">
          <div className="flex w-full justify-between items-center">
            <div className="flex gap-2 items-center">
              <AnimatePresence>
                {isSaved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="border-[1px] rounded-sm px-[4px]  border-green-700"
                  >
                    <span className="text-green-700 text-sm font-semibold">
                      Salvo
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="font-semibold text-2xl">{data.title}</span>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Question />
              </TooltipTrigger>
              <TooltipContent className="max-w-96">
                <span className="text-sm">{data.description}</span>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="font-normal text-sm">{data.label}</span>
        </div>

        <div className="w-full rounded-sm p-1 mt-4">
          <div className="flex gap-4">
            {tabs.map((currentTab, index) => (
              <div className="flex flex-col relative" key={index}>
                <button
                  key={index}
                  onClick={() => setTab(index)}
                  className={cn(
                    "text-md cursor-pointer",
                    index === tab && "font-semibold"
                  )}
                >
                  {currentTab}
                </button>

                {index === tab && (
                  <div className="absolute top-7 w-full h-[2px] rounded-full bg-black" />
                )}
              </div>
            ))}
          </div>
        </div>

        <hr className="w-full px-2 bg-gray-300 mb-2" />

        <Tab
          completion={feedback}
          handleUnsave={() =>
            setBrainstorm({
              ...(brainstorm as IScamperData),
              [data.id]: undefined,
            })
          }
          isGenerating={isLoading}
          userPrompt={USER_PROMPT}
          systemPrompt={SYSTEM_PROMPT}
          handleChangeFeedback={setFeedback}
          handleGenerate={handleGeneratePrompt}
          handleSaveFeedback={handleSaveBrainstorm}
          isSaved={brainstorm && brainstorm[data.id]}
          handleOpenSettings={() => setSettingsOpen(true)}
        />
      </div>

      <Sheet
        open={settingsOpen}
        onOpenChange={(p) => !p && handleCloseSettings()}
      >
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>{data.title}</SheetTitle>
            <SheetDescription>
              Altere os parametros para geração de resposta da IA Generativa
            </SheetDescription>
          </SheetHeader>

          <div className="flex px-4 flex-col">
            <hr className="w-full px-2 bg-gray-300 mb-2" />
            <span className="mt-2  font-semibold">Temperatura</span>
            <span className="font-normal text-sm text-gray-600 mb-2">
              Gerencie a criatividade do brainstorm
            </span>
            <Slider
              value={[temperature]}
              onValueChange={(e) => setTemperature(e[0])}
              max={100}
            />
          </div>

          <div className="flex px-4 flex-col">
            <hr className="w-full px-2 bg-gray-300 mb-2" />
            <span className="mt-2  font-semibold">Descrição geral</span>
            <span className="font-normal text-sm text-gray-600 mb-2">
              Descreva como a IA deve se considerar.
            </span>
            <Textarea
              className="min-h-[100px]"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
          </div>

          <div className="flex px-4 flex-col">
            <hr className="w-full px-2 bg-gray-300 mb-2" />
            <span className="mt-2  font-semibold">Sua descrição</span>
            <span className="font-normal text-sm text-gray-600 mb-2">
              Descreva o que a IA deve responder.
            </span>
            <Textarea
              className="min-h-[100px]"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
            />
          </div>

          <SheetFooter>
            <Button onClick={handleSetupSettings} variant={"outline"}>
              Reiniciar configurações
            </Button>
            <Button onClick={handleSaveSettings}>Salvar configurações</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
};

export default BrainBox;
