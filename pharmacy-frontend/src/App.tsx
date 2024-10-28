import React from 'react';
import './App.css';
import LoginPage from './components/login/LoginContent';
import SysAdminPage from './components/sysAdmin/SysAdmin';
import ManagerMain from './components/manager-gui/ManagerMain';
import StaffOverview from './components/manager-gui/StaffOverview';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Inventory from './components/inventory/Inventory';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<LoginPage />}/>
          <Route path='/LoginPage' element={<LoginPage />}/>
          <Route path='/SysAdminPage' element={<SysAdminPage />}/>
          <Route path='/ManagerMain' element={<ManagerMain />}/>
          <Route path='/Inventory' element={<Inventory />}/>
          <Route path='/StaffOverview' element={<StaffOverview />}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
