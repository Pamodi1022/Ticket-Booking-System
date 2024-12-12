import React, { useEffect, useState } from "react";
import axios from "axios";
import UserNavbar from './UserNavbar';
import '../Status.css'; // Import the CSS file

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
      <h2>Log Display</h2>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

export default Status;
