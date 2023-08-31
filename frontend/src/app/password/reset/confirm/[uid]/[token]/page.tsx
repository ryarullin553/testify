import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';
import { ResetPasswordContent } from '@/components/reset-passord-content/reset-passord-content';
import { FC } from 'react';

const ResetPasswordPage: FC = () => {
  return (
    <>
      <Header />
      <ResetPasswordContent />
      <Footer />
    </>
  )
}

export default ResetPasswordPage
