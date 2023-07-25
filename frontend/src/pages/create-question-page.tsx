import React, { FC } from 'react';
import { CreateQuestionContent } from '../components/create-question-content/create-question-content';
import { Footer } from '../components/footer/footer';
import { Header } from '../components/header/header';

export const CreateQuestionPage: FC = () => {
  return (
    <>
      <Header/>
      <CreateQuestionContent/>
      <Footer/>
    </>
  )
};
