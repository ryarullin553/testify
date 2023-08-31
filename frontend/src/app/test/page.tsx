import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import { TestContent } from "@/components/test-content/test-content";
import { FC } from "react";

const TestPage: FC = () => {
  return (
    <>
      <Header />
      <TestContent />
      <Footer />
    </>
  )
}

export default TestPage
