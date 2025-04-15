import { Button } from "@/components/ui/button";
import {
  ArrowsClockwise,
  FadersHorizontal,
} from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { Props } from "../types";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const FeedbackTab: React.FC<Props> = ({
  handleChangeFeedback,
  handleSaveFeedback,
  handleOpenSettings,
  handleGenerate,
  handleUnsave,
  isGenerating,
  completion,
  isSaved,
}) => {
  return (
    <div className="w-full flex items-center justify-center flex-col h-full">
      {completion ? (
        <div className="w-full flex flex-col h-full">
          <div className="w-full max-h-[200px] overflow-auto mt-2 h-full flex items-start justify-start">
            <Textarea
              value={completion}
              onChange={(e) => handleChangeFeedback(e.target.value)}
              className="h-full resize-none"
              disabled={isSaved}
            />
          </div>

          {isSaved ? (
            <Button onClick={handleUnsave} className="mt-2" variant={"outline"}>
              Editar
            </Button>
          ) : (
            <div className="w-full pt-6 pb-2 flex gap-2 justify-between">
              <Button variant={"outline"} onClick={handleOpenSettings}>
                <FadersHorizontal /> Configurações
              </Button>

              <div className="flex gap-2 items-center">
                <Button variant={"outline"} onClick={handleGenerate}>
                  Regenerar
                </Button>
                <Button onClick={handleSaveFeedback}>Salvar</Button>`
              </div>
            </div>
          )}
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
