import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { MainPageContent } from '../components/main-page-content/main-page-content';
import React, { FC } from 'react';

export const MainPage: FC = () => {
  return (
    <>
      <Header/>
      <MainPageContent/>
      <Footer/>
    </>
  )
};
