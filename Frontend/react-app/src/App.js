import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { CreateQuestionPage } from './pages/create-question-page';
import { CreateTestPage } from './pages/create-test-page';
import { MainPage } from "./pages/main-page";
import { AppRoute } from './consts/const';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'}>
          <Route index element={<MainPage />}/>
          <Route path={'/create-test'} element={<CreateTestPage />} />
          <Route path={'/edit-test'} element={<CreateQuestionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
