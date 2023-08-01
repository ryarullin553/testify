import { Header } from '@/components/header/header';
import { TestDescriptionContent } from '@/components/test-description-content/test-description-content';
import React, { FC } from 'react';

export const TestDescriptionPage: FC = () => {
  return (
    <>
      <Header />
      <TestDescriptionContent />
    </>
  );
}
