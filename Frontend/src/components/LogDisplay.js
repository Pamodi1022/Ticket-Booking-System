import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div style={{ marginBottom: "20px" }}>
      <h2>Log Display</h2>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

export default LogDisplay;
