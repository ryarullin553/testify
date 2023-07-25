import React, { FC } from 'react';
import { Header } from '../components/header/header';
import { TestDescriptionContent } from '../components/test-description-content/test-description-content';

export const TestDescriptionPage: FC = () => {
  return (
    <>
      <Header />
      <TestDescriptionContent />
    </>
  );
}
