import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { CreateQuestionPage } from './pages/create-question-page';
import { CreateTestPage } from './pages/create-test-page';
import { MainPage } from "./pages/main-page";
import { AppRoute } from './const';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoute.Root}>
          <Route index element={<MainPage />}/>
          <Route path={AppRoute.CreateTest} element={<CreateTestPage />} />
          <Route path={`${AppRoute.EditTest}/:id`} element={<CreateQuestionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
