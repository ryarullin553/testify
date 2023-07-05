import React, { FC } from "react";
import { Footer } from "../components/footer/footer";
import { Header } from "../components/header/header";
import { ResetPasswordContent } from "../components/reset-passord-content/reset-passord-content";

export const ResetPasswordPage: FC = () => {
  return (
    <>
      <Header />
      <ResetPasswordContent />
      <Footer />
    </>
  );
}
