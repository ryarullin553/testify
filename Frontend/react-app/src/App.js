import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { CreateQuestionPage } from './pages/create-question-page';
import { MainPage } from "./pages/main-page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'}>
          <Route index element={<MainPage />}/>
          <Route path={'/create-test'} element={<CreateQuestionPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
