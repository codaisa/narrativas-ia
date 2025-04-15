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

export type Props = {
  data: (typeof scamperQuestions)[0];
  prompt?: string;
  autoGenerate?: boolean;
};

const tabs = ["Feedback", "Configurações"];

const BrainBox: React.FC<Props> = ({ data, prompt, autoGenerate }) => {
  const SYSTEM_PROMPT = `Voce está trabalhando na metodologia SCAMPER. com base nesta ideia: ${prompt}. Voce receberá do usuário um questionamento do usuário a respeito de um dos métodos do scamper, ajude a pensar com base na ideia. Seja acertivo, não cite o método scamper. não faça perguntas somente responda.`;
  const USER_PROMPT = `método: ${data.title} /n/n base: ${data.description}`;

  const [tab, setTab] = useState(0);
  const { completion, handleSubmit, isLoading } = useCompletion({
    body: {
      prompt: USER_PROMPT,
      system: SYSTEM_PROMPT,
    },
    initialInput: "clean_data",
    api: "/api/completion",
  });

  const handleGeneratePrompt = useCallback(() => {
    handleSubmit();
  }, []);

  useEffect(() => {
    if (autoGenerate) {
      handleGeneratePrompt();
    }
  }, [autoGenerate]);

  const Tab = Tabs[Object.keys(Tabs)[tab]];

  return (
    <TooltipProvider>
      <div className="flex px-2 h-full py-1 flex-col w-full border-[1px] rounded-md border-gray-300">
        <div className=" flex items-start flex-col">
          <div className="flex w-full justify-between items-center">
            <span className="font-semibold text-2xl">{data.title}</span>

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
              <div className="flex flex-col relative">
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
          completion={completion}
          isGenerating={isLoading}
          userPrompt={USER_PROMPT}
          systemPrompt={SYSTEM_PROMPT}
          handleGenerate={handleGeneratePrompt}
        />
      </div>
    </TooltipProvider>
  );
};

export default BrainBox;
