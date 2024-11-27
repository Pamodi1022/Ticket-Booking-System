import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Vendornavbar.css';
import logo from './logo1.png';  // Make sure the path is correct

export default function VendorNavbar() {
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
        <li><Link to="/Vendor" onClick={toggleMenu}>Home</Link></li>
        <li><Link to="/Status" onClick={toggleMenu}>Status</Link></li>
        <li><Link to="/VendorHistory" onClick={toggleMenu}>History</Link></li>
        <li><Link to="/VendorProfile" onClick={toggleMenu}>Profile</Link></li>
      </ul>
    </div>
  );
}
