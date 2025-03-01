import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo1.png';  // Make sure the path is correct

export default function UserNavbar() {
  const [menuActive, setMenuActive] = useState(false);
  
  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };
  
  return (
    <div className="navbar">
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt="Ticket Logo" className="logo-img" />
        </Link>
        <h1 className="logo-text">Ticket.lk</h1>
      </div>
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={menuActive ? 'active' : ''}>
        <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
        <li><Link to="/TicketDisplay" onClick={toggleMenu}>Tickets</Link></li>
        <li><Link to="/LogDisplay" onClick={toggleMenu}>Ticket Log</Link></li>
        <li><Link to="/config" onClick={toggleMenu}>Configuration</Link></li>
      </ul>
    </div>
  );
}