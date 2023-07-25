import React, { FC } from "react";
import { Footer } from "../components/footer/footer";
import { Header } from "../components/header/header";
import { TestContent } from "../components/test-content/test-content";

export const TestPage: FC = () => {
  return (
    <>
      <Header />
      <TestContent />
      <Footer />
    </>
  );
}
