import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Signup from './components/Signup';
import TicketManagementForm from './Vendor/TicketManagementForm';

import Home from './Customer/Home';
import History from './Customer/History';
import Bookings from './Customer/Bookings';
import Profile from './Customer/Profile';
import CustomerNavbar from './Customer/CustomerNavbar';

import VendorProfile from './Vendor/VendorProfile';
import Status from './Vendor/Status';
import VendorHistory from './Vendor/VendorHistory';
import VendorHome from './Vendor/VendorHome';
import VendorNavbar from './Vendor/VendorNavbar';



function App() {
  const [userRole, setUserRole] = useState(""); // "Customer" or "Vendor"

  const handleLogin = (role) => {
    setUserRole(role); // Update the role on login
  };

  return (
    <Router>
      <div>
        {userRole === "Customer" && <CustomerNavbar />}
        {userRole === "Vendor" && <VendorNavbar />}

        <Routes>
          <Route path="/" element={<Signup onLogin={handleLogin} />} />
          <Route path="/" element={<Signup />} />
          <Route path="/Customer" element={<Home />} />
          <Route path="/Bookings" element={<Bookings />} />
          <Route path="/History" element={<History />} />
          <Route path="/Profile" element={<Profile />} />

          <Route path="/Vendor" element={<VendorHome />} />
          <Route path="/TicketManagement" element={<TicketManagementForm />} />
          <Route path="/Vendor" element={<VendorHome />} />
          <Route path="/Status" element={<Status />} />
          <Route path="/VendorHistory" element={<VendorHistory />} />
          <Route path="/VendorProfile" element={<VendorProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;