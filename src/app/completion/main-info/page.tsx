import React from "react";
import MainForm from "./_components/MainForm";
import NarrativaForm from "./_components/NarrativaForm";

const MainResumePage = () => {
  return (
    <div className="h-full w-screen flex flex-col items-center justify-center">
      <div className="md:w-2/4 w-full px-8 md:px-0 flex flex-col items-center">
        <span className="text-2xl font-semibold mb-6">Narrativas AI</span>
        <NarrativaForm />
        <MainForm />
      </div>
    </div>
  );
};

export default MainResumePage;
