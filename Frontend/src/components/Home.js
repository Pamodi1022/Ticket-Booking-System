import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfigForm from "./ConfigForm";
import UserNavbar from "./UserNavbar";
import "../styles/Home.css"; // We'll create this file for styling

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
            <h1>Book Your Tickets Now</h1>
            <p>
              Experience the thrill of live events with our real-time ticket booking system. 
              Secure your spot for the hottest concerts, shows, and performances.
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
      </div>

      {/* Configuration and Ticket Display Section */}
      <div className="config-ticket-section" id="config-section">
        <div className="section-title">
          <h2>Configure & View Tickets</h2>
          <p>Set up your event parameters and monitor ticket availability in real-time</p>
        </div>
        <div className="config-ticket-container">
          <div className="ticket-preview">
            <h3>Current Ticket Status</h3>
            <div className="ticket-preview-content">
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
          <div className="config-form-wrapper">
            <h3>Event Configuration</h3>
            <ConfigForm homePageMode={true} />
          </div>
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
  );
};

export default Home;