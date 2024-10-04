import React from 'react';
import './App.css';
import LoginPage from './components/login/LoginContent';
import HomePage from './components/home/Home';
import { BrowserRouter,Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<LoginPage />}/>
          <Route path='/LoginPage' element={<LoginPage />}/>
          <Route path='/HomePage' element={<HomePage />}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
