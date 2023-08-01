import { EditTestDescriptionContent } from '@/components/edit-test-description-content/edit-test-description-content';
import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';
import React, { FC } from 'react';

export const EditTestDescriptionPage: FC = () => {
  return (
    <>
      <Header />
      <EditTestDescriptionContent />
      <Footer />
    </>
  );
}
