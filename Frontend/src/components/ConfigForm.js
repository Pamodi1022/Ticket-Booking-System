import React, { useState } from "react";
import axios from "axios";

const ConfigForm = () => {
  const [config, setConfig] = useState({
    totalTickets: "",
    ticketReleaseRate: "",
    ticketRetrievalRate: "",
    maxCapacity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/api/tickets/submit", config)
      .then(() => alert("Configuration submitted successfully!"))
      .catch((error) => console.error("Error submitting configuration:", error));
  };

  return (
    <div>
      <h2>Configuration Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Total Tickets: </label>
          <input
            type="number"
            name="totalTickets"
            value={config.totalTickets}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Ticket Release Rate: </label>
          <input
            type="number"
            name="ticketReleaseRate"
            value={config.ticketReleaseRate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Ticket Retrieval Rate: </label>
          <input
            type="number"
            name="ticketRetrievalRate"
            value={config.ticketRetrievalRate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Max Capacity: </label>
          <input
            type="number"
            name="maxCapacity"
            value={config.maxCapacity}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit Configuration</button>
      </form>
    </div>
  );
};

export default ConfigForm;
