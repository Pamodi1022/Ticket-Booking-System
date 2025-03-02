import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfigForm from "./ConfigForm";
import LogDisplay from "./LogDisplay";
import UserNavbar from "./UserNavbar";
import "../styles/Home.css"; // Ensure this file exists for styling

// Import all event images
import EventImg1 from "../assets/event1.jpeg"; // Replace with your actual image paths
import EventImg2 from "../assets/event2.jpeg"; // Placeholder - replace with actual image
import EventImg3 from "../assets/event3.jpeg"; // Placeholder - replace with actual image
import EventImg4 from "../assets/event4.jpeg"; // Placeholder - replace with actual image
import EventImg5 from "../assets/event5.jpeg"; // Placeholder - replace with actual image
import EventImg6 from "../assets/event6.jpeg";

const Home = () => {
  // State for image carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [EventImg1, EventImg2, EventImg3, EventImg4, EventImg5, EventImg6];

  // Auto scroll for images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="home-container">
      <UserNavbar />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Real-Time Ticketing Simulator</h1>
            <p>
            Experience the power of a real-time ticketing system designed to simulate live event ticket sales. This system allows you to monitor available tickets, sold tickets, and ticket sales rates in real time, providing a dynamic and interactive view of ticket availability.
            </p>
            <Link to="/ViewDetail" className="cta-button">
              View Available Tickets
            </Link>
          </div>
          <div className="hero-image">
            <div className="image-carousel">
              <img
                src={images[currentImageIndex]}
                alt={`Event ${currentImageIndex + 1}`}
                className="carousel-image"
              />
              <div className="carousel-indicators">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`indicator ${index === currentImageIndex ? "active" : ""}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      

        {/* Configuration and Log Display Section */}
        <div className="config-ticket-section" id="config-section">
          <div className="section-title">
            <h1>Configure & View Tickets</h1>
            <p>Set up your event parameters and monitor ticket availability in real-time</p>
          </div>
          <div className="config-log-section">
            <div className="config-form-wrapper">
              <h3>Event Configuration</h3>
              <ConfigForm homePageMode={true} />
            </div>
            <div className="log-display-wrapper">
              <h3>Activity Log</h3>
              <LogDisplay homePageMode={true} />
            </div>
          </div>

          {/* Ticket Status Section */}
          <div className="ticket-status-section">
            <div className="section-title">
              <h1>Current Ticket Status</h1>
            </div>
            <div className="ticket-status-content">
              <iframe
                title="Ticket Display Preview"
                src="/TicketDisplay"
                className="ticket-iframe"
              />
              <Link to="/ViewDetail" className="view-full-button">
                View Full Details
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="features-section">
            <div className="feature">
              <div className="feature-icon">🎫</div>
              <h3>Real-time Updates</h3>
              <p>Monitor ticket availability as it changes second by second</p>
            </div>
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h3>Fast Booking</h3>
              <p>Secure your tickets with our lightning-fast booking system</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📊</div>
              <h3>Detailed Analytics</h3>
              <p>Track ticket sales and performance with comprehensive logs</p>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Ticket.lk. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;