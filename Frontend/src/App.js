import './App.css';
import Home from './Customer/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import History from './Customer/History';
import Bookings from './Customer/Bookings';
import Profile from './Customer/Profile';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Bookings" element={<Bookings />} />
          <Route path="/History" element={<History />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;