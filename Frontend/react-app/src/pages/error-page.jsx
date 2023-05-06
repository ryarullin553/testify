import { ErrorPageContent } from '../components/error-page-content/error-page-content';
import { Footer } from '../components/footer/footer';
import { Header } from '../components/header/header';

export const ErrorPage = ({errorCode}) => {
  return (
    <>
      <Header />
      <ErrorPageContent />
      <Footer />
    </>
  );
}
