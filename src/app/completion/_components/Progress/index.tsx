"use client";

import { Progress } from "@/components/ui/progress";
import { useStore } from "@/stores/useStore";
import React from "react";

const CustomProgress = () => {
  const prompt = useStore((state) => state.prompt);

  return (
    <Progress className="h-[2px] w-full rounded-none" value={prompt ? 75 : 0} />
  );
};

export default CustomProgress;
