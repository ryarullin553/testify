import { CreateQuestionContent } from '@/components/create-question-content/create-question-content';
import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';
import React, { FC } from 'react';

export const CreateQuestionPage: FC = () => {
  return (
    <>
      <Header/>
      <CreateQuestionContent/>
      <Footer/>
    </>
  )
};
