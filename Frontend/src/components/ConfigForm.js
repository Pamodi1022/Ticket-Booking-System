import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import "../styles/ConfigFormstyles.css";

const ConfigForm = ({ homePageMode = false }) => {
  const [config, setConfig] = useState({
    totalTickets: "",
    ticketReleaseRate: "",
    ticketRetrievalRate: "",
    maxCapacity: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update state
    setConfig({ ...config, [name]: value });

    // Validate input
    if (value <= 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Value must be greater than 0",
      }));
    } else {
      setErrors((prevErrors) => {
        const { [name]: removed, ...remainingErrors } = prevErrors;
        return remainingErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for errors before submitting
    const validationErrors = {};
    Object.keys(config).forEach((key) => {
      if (config[key] <= 0) {
        validationErrors[key] = "Value must be greater than 0";
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit the configuration
    axios
      .post("http://localhost:8080/api/tickets/submit", config)
      .then(() => {
        alert("Configuration submitted successfully!");

        // Clear input fields by resetting the state
        setConfig({
          totalTickets: "",
          ticketReleaseRate: "",
          ticketRetrievalRate: "",
          maxCapacity: "",
        });

        // Optionally clear errors
        setErrors({});

        // Navigate to the TicketDisplay page after successful submission
        if (!homePageMode) {
          navigate("/TicketDisplay");
        }
      })
      .catch((error) => console.error("Error submitting configuration:", error));
  };

  // If component is used on home page, render a more compact version
  const formClass = homePageMode ? "config-form-container-compact" : "config-form-container";
  const backgroundClass = homePageMode ? "" : "config-form-background";

  return (
    <>
      {/* Only render the navbar when not in home page mode */}
      {!homePageMode && <UserNavbar />}
      
      <div className={backgroundClass}>
        <div className={formClass}>
          {!homePageMode && <h2 className="config-form-title">Configuration Form</h2>}
          <form onSubmit={handleSubmit}>
            <div className="config-form-group">
              <label><b>Total Tickets: </b></label>
              <input
                type="number"
                name="totalTickets"
                value={config.totalTickets}
                onChange={handleChange}
                className="config-input-field"
                required
              />
              {errors.totalTickets && (
                <span className="config-error-message">{errors.totalTickets}</span>
              )}
            </div>
            <div className="config-form-group">
              <label><b>Ticket Release Rate: </b></label>
              <input
                type="number"
                name="ticketReleaseRate"
                value={config.ticketReleaseRate}
                onChange={handleChange}
                className="config-input-field"
                required
              />
              {errors.ticketReleaseRate && (
                <span className="config-error-message">{errors.ticketReleaseRate}</span>
              )}
            </div>
            <div className="config-form-group">
              <label><b>Ticket Retrieval Rate: </b></label>
              <input
                type="number"
                name="ticketRetrievalRate"
                value={config.ticketRetrievalRate}
                onChange={handleChange}
                className="config-input-field"
                required
              />
              {errors.ticketRetrievalRate && (
                <span className="config-error-message">{errors.ticketRetrievalRate}</span>
              )}
            </div>
            <div className="config-form-group">
              <label><b>Max Capacity: </b></label>
              <input
                type="number"
                name="maxCapacity"
                value={config.maxCapacity}
                onChange={handleChange}
                className="config-input-field"
                required
              />
              {errors.maxCapacity && (
                <span className="config-error-message">{errors.maxCapacity}</span>
              )}
            </div>
            <button type="submit" className="config-submit-btn">
              <b>Submit Configuration</b>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ConfigForm;