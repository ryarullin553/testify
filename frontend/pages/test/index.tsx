import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import { TestContent } from "@/components/test-content/test-content";
import React, { FC } from "react";

export const TestPage: FC = () => {
  return (
    <>
      <Header />
      <TestContent />
      <Footer />
    </>
  );
}
