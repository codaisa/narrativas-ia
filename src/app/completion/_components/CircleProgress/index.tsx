"use client";

import { ProgressCircle } from "@/components/ui/progress-circle";
import { useStore } from "@/stores/useStore";
import React from "react";
import { scamperQuestions } from "../../brainstorm/_common";

const CustomCircleProgress = () => {
  const prompt = useStore((state) => state.prompt);
  const brainstorm = useStore((state) => state.brainstorm);
  const totalCompleted = brainstorm
    ? scamperQuestions.reduce(
        (acc, item) => (!!brainstorm[item.id] ? acc + 1 : acc),
        0
      )
    : 0;

  return prompt ? (
    <ProgressCircle
      label={`${totalCompleted}/${scamperQuestions.length}`}
      value={(totalCompleted / scamperQuestions.length) * 100}
    />
  ) : (
    <div />
  );
};

export default CustomCircleProgress;
