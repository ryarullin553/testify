import React, { FC } from 'react';
import { Header } from '../components/header/header';
import { MyTestsPageContent } from '../components/my-tests-page-content/my-tests-page-content';

export const MyTestsPage: FC = () => {
  return (
    <>
      <Header />
      <MyTestsPageContent />
    </>
  );
}
