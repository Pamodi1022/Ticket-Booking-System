import React, { useEffect, useState } from "react";
import axios from "axios";
import UserNavbar from './UserNavbar';
import '../styles/LogDisplay.css'; // Import the CSS file
import { FaTicketAlt, FaUser, FaClock, FaInfoCircle } from 'react-icons/fa'; // Import icons from react-icons
import Popup from 'reactjs-popup'; // Import reactjs-popup for the popup functionality
import 'reactjs-popup/dist/index.css'; // Import the default styles for reactjs-popup

// Status Component
const Status = ({ homePageMode }) => {
  const formClass = homePageMode ? "config-form-container-compact" : "config-form-container";
  const backgroundClass = homePageMode ? "" : "config-form-background";

  return (
    <div className={backgroundClass}>
      {!homePageMode && <UserNavbar />}
      <div className={formClass}>
        <LogDisplay />
      </div>
    </div>
  );
};

// LogDisplay Component
const LogDisplay = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = () => {
      axios
        .get("http://localhost:8080/api/tickets/logs")
        .then((response) => setLogs(response.data))
        .catch((error) => console.error("Error fetching logs:", error));
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 1000);
    return () => clearInterval(interval);
  }, []);

  // Function to handle the "View Details" button click
  const handleViewDetails = (log) => {
    console.log("View Details for:", log);
    // You can add additional logic here if needed
  };

  return (
    <div className="log-display">    
      <ul className="log-list">
        {/* <h2>Activity Log</h2> */}
        {logs.map((log, index) => (
          <li key={index} className="log-entry">
            <div className="log-icon">
              {log.includes("purchased") ? <FaTicketAlt /> : <FaUser />}
            </div>
            <div className="log-content">
              <span className="log-message">{log}</span>
              
            </div>
            {/* Popup for View Details */}
            <Popup
              trigger={
                <button className="view-details-button">
                  <FaInfoCircle /> View Details
                </button>
              }
              modal
              nested
            >
              {(close) => (
                <div className="popup-container">
                  <h3>Ticket Details</h3>
                  <p><strong>Activity:</strong> {log}</p>
                  {/* <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p> */}
                  <button onClick={close} className="close-button">
                    Close
                  </button>
                </div>
              )}
            </Popup>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Status;