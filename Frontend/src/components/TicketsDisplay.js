import React, { useEffect, useState } from "react";
import axios from "axios";

const TicketsDisplay = () => {
  const [availableTickets, setAvailableTickets] = useState(0);

  useEffect(() => {
    const fetchTickets = () => {
      axios
        .get("http://localhost:8080/api/tickets/available")
        .then((response) => setAvailableTickets(response.data))
        .catch((error) => console.error("Error fetching tickets:", error));
    };

    fetchTickets();
    const interval = setInterval(fetchTickets, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Tickets Display</h2>
      <p>Available Tickets: {availableTickets}</p>
    </div>
  );
};

export default TicketsDisplay;
