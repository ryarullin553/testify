import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { CreateQuestionPage } from './pages/create-question-page';
import { CreateTestPage } from './pages/create-test-page';
import { MainPage } from "./pages/main-page";
import { AppRoute } from './const';
import { MyTestsPage } from './pages/my-tests-page';
import { ProfilePage } from './pages/profile-page';
import { ProfileSettingPage } from './pages/profile-settings-page'
import { UserActivationPage } from './pages/user-activation-page';
import { ResetPasswordPage } from './pages/reset-password-page';
import { EditTestDescriptionPage } from './pages/edit-test-description-page';
import { ProfileTests } from './pages/profile-tests';
import { ProfileBookmarkPage } from './pages/profile-bookmark-page'
import { TestPage } from './pages/test-page';
import { ErrorPage } from './pages/error-page';
import { ResultsPage } from './pages/results-page';
import { CatalogPage } from './pages/catalog-page';
import { TestDescriptionPage } from './pages/test-description-page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoute.Root}>
          <Route index element={<MainPage />} />
          <Route path={AppRoute.Catalog} element={<CatalogPage/>} />
          <Route path={`${AppRoute.TestDescription}/:testID`} element={<TestDescriptionPage/>} />
          <Route path={`${AppRoute.TestMain}/:testID`} element={<TestPage/>} />
          <Route path={`${AppRoute.Results}/:attemptID`} element={<ResultsPage/>} />
          <Route path={AppRoute.CreateTest} element={<CreateTestPage />} />
          <Route path={AppRoute.EditTest} >
            <Route path={`${AppRoute.EditTest}/:testID`} element={<CreateQuestionPage />} />
            <Route path={`${AppRoute.EditTestDescription}/:testID`} element={<EditTestDescriptionPage />} />
          </Route>
          <Route path={AppRoute.Profile} element={<ProfilePage />} />
          <Route path={AppRoute.MyTests} element={<MyTestsPage />} />
          <Route path={AppRoute.ProfileTests} element={<ProfileTests />} />
          <Route path={AppRoute.ProfileBookmark} element={<ProfileBookmarkPage />} />
          <Route path={AppRoute.ProfileSetting} element={<ProfileSettingPage />} />
          <Route path={AppRoute.UserActivation} element={<UserActivationPage />} />
          <Route path={AppRoute.PasswordReset} element={<ResetPasswordPage />} />
          <Route path='*' element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
