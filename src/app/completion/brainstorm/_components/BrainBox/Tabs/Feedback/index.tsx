import { Button } from "@/components/ui/button";
import { ArrowsClockwise } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { Props } from "../types";
import { cn } from "@/lib/utils";

const FeedbackTab: React.FC<Props> = ({
  handleGenerate,
  isGenerating,
  completion,
}) => {
  return (
    <div className="w-full flex items-center justify-center flex-col h-full">
      {completion ? (
        <div className="w-full flex flex-col h-full">
          <div className="w-full max-h-[200px] overflow-auto mt-2 h-full flex items-start justify-start">
            <span>{completion}</span>
          </div>

          <div className="w-full pt-6 pb-2 flex gap-2 justify-end">
            <Button variant={"outline"} onClick={handleGenerate}>
              Regenerar
            </Button>
            <Button>Salvar</Button>
          </div>
        </div>
      ) : (
        <div className="my-14 w-full flex items-center justify-center flex-col">
          <ArrowsClockwise
            size={92}
            className={cn(!isGenerating ? "" : "animate-spin")}
          />

          {!isGenerating && (
            <>
              <span className="font-normal text-sm">
                Nenhuma resposta gerada
              </span>
              <Button
                onClick={handleGenerate}
                variant={"outline"}
                className="mt-2"
              >
                Criar feedback inicial
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackTab;
