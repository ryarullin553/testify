import { CreateQuestionContent } from '@/components/create-question-content/create-question-content';
import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';
import { FC } from 'react';

const CreateQuestionPage: FC = () => {
  return (
    <>
      <Header/>
      <CreateQuestionContent/>
      <Footer/>
    </>
  )
}

export default CreateQuestionPage
