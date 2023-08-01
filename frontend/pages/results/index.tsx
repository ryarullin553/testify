import { Header } from "@/components/header/header";
import { ResultsContent } from "@/components/results-content/results-content";
import React, { FC } from "react";

export const ResultsPage: FC = () => {
  return (
    <>
      <Header/>
      <ResultsContent />
    </>
  );
}
