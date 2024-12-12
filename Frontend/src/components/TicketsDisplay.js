import React, { useEffect, useState } from "react"; // Import React hooks
import axios from "axios"; // Import axios for HTTP requests
import ControlPanel from "./ControlPanel"; // Import ControlPanel component (check the path)
import UserNavbar from "./UserNavbar"; // Import UserNavbar component (check the path)
import "../Ticketstyles.css";
import Event from './Event.png';

const TicketsDisplay = () => {
const [availableTickets, setAvailableTickets] = useState(0);
const [totalTickets, setTotalTickets] = useState(0);

  // Fetch available tickets
  useEffect(() => {
    const fetchAvailableTickets = () => {
      axios
        .get("http://localhost:8080/api/tickets/available")
        .then((response) => setAvailableTickets(response.data))
        .catch((error) => console.error("Error fetching available tickets:", error));
    };

    fetchAvailableTickets();
    const interval = setInterval(fetchAvailableTickets, 1000); // Refresh every second
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Fetch total tickets
  useEffect(() => {
    const fetchTotalTickets = () => {
      axios
        .get("http://localhost:8080/api/tickets/total")
        .then((response) => setTotalTickets(response.data))
        .catch((error) => console.error("Error fetching total tickets:", error));
    };

    fetchTotalTickets();
    const interval = setInterval(fetchTotalTickets, 1000); // Refresh every second
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div>
      <UserNavbar /> {/* Navbar Component */}
      <div className="tickets-display">
        <div className="image-container">
          <img src={Event} alt="Event" className="event-image" />
          <div className="ticket-info">
            <p>Available Tickets: {availableTickets}</p>
            <p>Total Tickets: {totalTickets}</p>
          </div>
          <ControlPanel /> {/* Control Panel Component */}
        </div>
      </div>
    </div>
  );
};

export default TicketsDisplay;
