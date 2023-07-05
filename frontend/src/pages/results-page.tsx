import React, { FC } from "react";
import { Header } from "../components/header/header";
import { ResultsContent } from "../components/results-content/results-content";

export const ResultsPage: FC = () => {
  return (
    <>
      <Header/>
      <ResultsContent />
    </>
  );
}
