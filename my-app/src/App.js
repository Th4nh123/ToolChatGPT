import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from './component/base/Main';
import NewProject from './component/libs/NewProject';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Main />}></Route>
          <Route path='test' element={<NewProject />}></Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
