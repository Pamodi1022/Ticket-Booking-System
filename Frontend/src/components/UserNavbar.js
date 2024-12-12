import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo1.png';  // Make sure the path is correct

export default function UserNavbar() {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div className="navbar">
      <div className="logo-container">
        <img src={logo} alt="Ticket Logo" className="logo-img" />  {/* Add the logo image */}
        <h1 className="logo-text">Ticket.lk</h1>  {/* Logo text */}
      </div>
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={menuActive ? 'active' : ''}>
        <li><Link to="/TicketDisplay" onClick={toggleMenu}>Tickets</Link></li>
        <li><Link to="/LogDisplay" onClick={toggleMenu}>Ticket Log</Link></li>
      </ul>
    </div>
  );
}
