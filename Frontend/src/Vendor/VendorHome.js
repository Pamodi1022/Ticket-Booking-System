import React from 'react'
import VendorNavbar from '../Vendor/VendorNavbar'
import { Link } from 'react-router-dom';

export default function VendorHome() {
  return (
    <><div>
        <VendorNavbar />
      </div>

      <div className='content'>
        <h1>Vendor Home</h1>
        <Link to="/VendorProfile">
            <button>BUY</button>
        </Link>
      </div></>
  )
}
