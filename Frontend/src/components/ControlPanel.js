import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ControlPanel = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const startSimulation = () => {
    axios.post("http://localhost:8080/api/tickets/start").catch((error) => {
      console.error("Error starting simulation:", error);
    });
  };

  const stopSimulation = () => {
    axios.post("http://localhost:8080/api/tickets/stop").catch((error) => {
      console.error("Error stopping simulation:", error);
    });
  };

  const reset = () => {
    axios
      .post("http://localhost:8080/api/tickets/Reset")
      .then(() => {
        // Navigate to ConfigurationForm after reset
        navigate("/TicketDisplay"); // This will navigate to the root route (ConfigurationForm)
      })
      .catch((error) => {
        console.error("Error resetting simulation:", error);
      });
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Control Panel</h2>
      <button onClick={startSimulation} style={{ marginRight: "10px" }}>
        Start
      </button>
      <button onClick={stopSimulation}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

export default ControlPanel;
