import { Header } from '@/components/header/header';
import { MyTestsPageContent } from '@/components/my-tests-page-content/my-tests-page-content';
import React, { FC } from 'react';

export const MyTestsPage: FC = () => {
  return (
    <>
      <Header />
      <MyTestsPageContent />
    </>
  );
}
