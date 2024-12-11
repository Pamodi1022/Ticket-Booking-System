import React, { useEffect, useState } from "react";
import axios from "axios";
import UserNavbar from './UserNavbar';
import ControlPanel from "./ControlPanel";

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
      <UserNavbar />
      <ControlPanel />
      <div style={{ marginBottom: "20px" }}>
        <h2>Tickets Display</h2>
        <p>Available Tickets: {availableTickets}</p>
        <p>Total Tickets: {totalTickets}</p>
      </div>
    </div>
  );
};

export default TicketsDisplay;
