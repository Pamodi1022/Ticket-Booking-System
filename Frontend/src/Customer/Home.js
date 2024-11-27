import React from 'react'
import CustomerNavbar from './CustomerNavbar'
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <><div>
        <CustomerNavbar />
      </div>

      <div className='content'>
        <h1>Home</h1>
        <Link to="/Profile">
            <button>BUY</button>
        </Link>
      </div></>
  )
}
