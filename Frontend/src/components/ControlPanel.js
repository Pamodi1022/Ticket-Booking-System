import React from "react";
import axios from "axios";

const ControlPanel = () => {
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

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Control Panel</h2>
      <button onClick={startSimulation} style={{ marginRight: "10px" }}>
        Start
      </button>
      <button onClick={stopSimulation}>Stop</button>
    </div>
  );
};

export default ControlPanel;
