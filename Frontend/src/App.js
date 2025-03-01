import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Home from './components/Home';
import ConfigForm from './components/ConfigForm';
import TicketsDisplay from './components/TicketsDisplay';
import LogDisplay from './components/LogDisplay';
import ViewDetail from './components/ViewDetail';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/config" element={<ConfigForm />} />
          <Route path="/TicketDisplay" element={<TicketsDisplay />} />
          <Route path="/LogDisplay" element={<LogDisplay />} />
          <Route path="/ViewDetail" element={<ViewDetail />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;