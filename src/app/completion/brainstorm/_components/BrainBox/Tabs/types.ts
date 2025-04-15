export type Props = {
  handleChangeFeedback: (val: string) => void;
  handleSaveFeedback: () => void;
  handleOpenSettings: () => void;
  handleGenerate: () => void;
  handleUnsave: () => void;
  isGenerating?: boolean;
  completion?: string;
  isSaved?: boolean;

  systemPrompt?: string;
  userPrompt?: string;
};
