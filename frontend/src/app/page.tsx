import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';
import { MainPageContent } from '@/components/main-page-content/main-page-content';
import React, { FC } from 'react';

const MainPage: FC = () => {
  return (
    <>
      <Header/>
      <MainPageContent/>
      <Footer/>
    </>
  )
}

export default MainPage
