import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ControlPanel = () => {
  const navigate = useNavigate();

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
    axios.post("http://localhost:8080/api/tickets/reset")
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error resetting simulation:", error);
      });
  };

  return (
    <div className="control-panel">
      <button className="reset-button" onClick={reset}>
        Reset
      </button>
      <div className="action-buttons">
        <button onClick={startSimulation} className="start-button">
          Start
        </button>
        <button onClick={stopSimulation} className="stop-button">
          Stop
        </button>
      </div>
    </div>
  );
};

export default ControlPanel; // Export as default
