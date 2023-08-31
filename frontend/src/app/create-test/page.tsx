import { EditTestDescriptionContent } from '@/components/edit-test-description-content/edit-test-description-content';
import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';
import { FC } from 'react';

const CreateTestPage: FC = () => {
  return (
    <>
      <Header />
      <EditTestDescriptionContent />
      <Footer />
    </>
  )
}

export default CreateTestPage
