import React from "react";
import MainForm from "./_components";

const MainResumePage = () => {
  return (
    <div className="h-full w-screen flex flex-col items-center justify-center">
      <div className="md:w-2/4 w-full px-8 md:px-0">
        <span className="text-2xl font-semibold">Narrativas AI</span>
        <MainForm />
      </div>
    </div>
  );
};

export default MainResumePage;
