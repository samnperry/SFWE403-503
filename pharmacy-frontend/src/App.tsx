import React from 'react';
import './App.css';
import LoginPage from './components/login/LoginContent';
import SysAdminPage from './components/sysAdmin/SysAdmin';
import ManagerMain from './components/manager-gui/ManagerMain';
import StaffOverview from './components/manager-gui/StaffOverview';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Inventory from './components/inventory/Inventory';
import Pharm from './components/pharm-gui/Pharm';
import PatientManager from './components/patient-gui/Patient';
import Cashier from './components/cashier-gui/Cashier';
import Profile from './components/profile-gui/Profile';
import PharmacistInventory from './components/pharmacist-inv/PharmacistInventory';
import PharmacistCashier from './components/pharmacist-cashier/PharmacistCashier';
import { UserProvider } from './components/UserContext'



function App() {
  return (
    <div className="App">
      <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<LoginPage />}/>
          <Route path='/LoginPage' element={<LoginPage />}/>
          <Route path='/SysAdminPage' element={<SysAdminPage />}/>
          <Route path='/ManagerMain' element={<ManagerMain />}/>
          <Route path='/Inventory' element={<Inventory />}/>
          <Route path='/StaffOverview' element={<StaffOverview />}/>
          <Route path='/Pharm' element={<Pharm/>}/>
          <Route path='/PatientManager' element={<PatientManager/>}/>
          <Route path='/Cashier' element={<Cashier/>}/>
          <Route path='/ProfilePage' element={<Profile/>}/>
          <Route path='/PharmacistInventory' element={<PharmacistInventory/>}/>
          <Route path='/PharmacistCashier' element={<PharmacistCashier/>}/>
        </Routes>
      </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
