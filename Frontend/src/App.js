import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ConfigForm from './components/ConfigForm.js';
import TicketsDisplay from './components/TicketsDisplay';
import LogDisplay from './components/LogDisplay';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ConfigForm />} />
          <Route path="/TicketDisplay" element={<TicketsDisplay />} />
          <Route path="/LogDisplay" element={<LogDisplay />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
