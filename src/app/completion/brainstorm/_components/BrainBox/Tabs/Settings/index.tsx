import React from "react";
import { Props } from "../types";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

const SettingsTab: React.FC<Props> = ({ systemPrompt, userPrompt }) => {
  return (
    <div className="flex flex-col w-full max-h-[240px] overflow-auto">
      <div className="flex flex-col w-full gap-2">
        <div className="w-full justify-between font">
          <span>Temperatura</span>
        </div>
        <Slider value={[50]} />
      </div>

      <span className="mt-4">Prompts</span>

      <Textarea placeholder="Sistema" className="mt-2" value={systemPrompt} />
      <Textarea placeholder="Usuário" className="mt-2" value={userPrompt} />
    </div>
  );
};

export default SettingsTab;
