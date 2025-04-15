export type Props = {
  handleGenerate: () => void;
  isGenerating?: boolean;
  completion?: string;

  systemPrompt?: string;
  userPrompt?: string;
};
