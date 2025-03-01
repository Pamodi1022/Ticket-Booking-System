import React, { useEffect, useState } from "react";
import axios from "axios";
import UserNavbar from './UserNavbar';
import '../styles/LogDisplay.css'; // Import the CSS file
import { FaTicketAlt, FaUser, FaClock, FaInfoCircle } from 'react-icons/fa'; // Import icons from react-icons

// Status Component
const Status = () => {
  return (
    <div>
      <UserNavbar />
      <LogDisplay />
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

  return (
    <div className="log-display">
      <h2>Activity Log</h2>
      <ul className="log-list">
        {logs.map((log, index) => (
          <li key={index} className="log-entry">
            <div className="log-icon">
              {log.includes("purchased") ? <FaTicketAlt /> : <FaUser />}
            </div>
            <div className="log-content">
              <span className="log-message">{log}</span>
              <span className="log-timestamp">
                <FaClock /> {new Date().toLocaleTimeString()}
              </span>
            </div>
            <button className="view-details-button">
              <FaInfoCircle /> View Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Status;