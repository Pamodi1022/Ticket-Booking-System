import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ViewStyles.css";
import UserNavbar from "./UserNavbar";
import Event from '../assets/event1.jpeg';

const ViewDetail = () => {
  const [availableTickets, setAvailableTickets] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [soldTickets, setSoldTickets] = useState(0);
  const [maxCapacity, setMaxCapacity] = useState(0);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const navigate = useNavigate();

  // Fetch available tickets
  useEffect(() => {
    const fetchAvailableTickets = () => {
      axios
        .get("http://localhost:8080/api/tickets/available")
        .then((response) => {
          setAvailableTickets(response.data);
          // Calculate sold tickets based on total - available
          if (totalTickets > 0) {
            setSoldTickets(totalTickets - response.data);
          }
        })
        .catch((error) => console.error("Error fetching available tickets:", error));
    };

    fetchAvailableTickets();
    const interval = setInterval(fetchAvailableTickets, 1000); // Refresh every second
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [totalTickets]); // Added totalTickets as dependency

  // Fetch total tickets
  useEffect(() => {
    const fetchTotalTickets = () => {
      axios
        .get("http://localhost:8080/api/tickets/total")
        .then((response) => {
          setTotalTickets(response.data);
          // Reset sold tickets if total tickets changes to zero
          if (response.data === 0) {
            setSoldTickets(0);
          }
        })
        .catch((error) => console.error("Error fetching total tickets:", error));
    };

    fetchTotalTickets();
    const interval = setInterval(fetchTotalTickets, 1000); // Refresh every second
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Fetch max capacity
useEffect(() => {
    const fetchMaxCapacity = () => {
      axios
        .get("http://localhost:8080/api/tickets/max")
        .then((response) => {
          setMaxCapacity(response.data);
        })
        .catch((error) => console.error("Error fetching max capacity:", error));
    };
  
    fetchMaxCapacity();
  }, []); // Runs only once when the component mounts
  

  // Control panel functions
  const startSimulation = () => {
    axios.post("http://localhost:8080/api/tickets/start")
      .then(() => {
        setIsSimulationRunning(true);
        // Reset sold tickets counter when simulation starts
        setSoldTickets(0);
      })
      .catch((error) => {
        console.error("Error starting simulation:", error);
      });
  };

  const stopSimulation = () => {
    axios.post("http://localhost:8080/api/tickets/stop")
      .then(() => {
        setIsSimulationRunning(false);
      })
      .catch((error) => {
        console.error("Error stopping simulation:", error);
      });
  };

  const reset = () => {
    axios.post("http://localhost:8080/api/tickets/reset")
      .then(() => {
        setSoldTickets(0); // Reset sold tickets on reset
        setIsSimulationRunning(false);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error resetting simulation:", error);
      });
  };

  // Calculate percentage of tickets available (out of total)
  const percentageAvailable = totalTickets > 0 ? (availableTickets / maxCapacity) * 100 : 0;
  
  // Calculate percentage of sold tickets (out of total)
  const percentageSold = totalTickets > 0 ? (soldTickets / totalTickets) * 100 : 0;
  
  return (
      <div>
        <UserNavbar />
        <div className="tickets-container">
          <div className="event-banner" style={{ backgroundImage: `url(${Event})` }}>
            <h1>Event Ticket Dashboard</h1>
          </div>
          
          <div className="tickets-display">
            <div className="ticket-stats">
              <div className="ticket-card">
                <h2>Available Tickets</h2>
                <div className="ticket-number">{availableTickets}</div>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: `${percentageAvailable}%`, backgroundColor: "#3498db" }}
                  ></div>
                </div>
                <div className="progress-label">{percentageAvailable.toFixed(1)}% of total</div>
              </div>
              
              <div className="ticket-card">
                <h2>Total Tickets</h2>
                <div className="ticket-number">{soldTickets}</div>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: `${percentageSold}%`, backgroundColor: "#e74c3c" }}
                  ></div>
                </div>
                <div className="progress-label">{percentageSold.toFixed(1)}% of total</div>
              </div>
              
              {/* <div className="ticket-card">
                <h2>Sold Tickets</h2>
                <div className="ticket-number">{soldTickets}</div>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: `${percentageSold}%`, backgroundColor: "#e74c3c" }}
                  ></div>
                </div>
                <div className="progress-label">{percentageSold.toFixed(1)}% of total</div>
              </div> */}
            </div>
            
            <div className="control-panel">
              <h2>Simulation Controls</h2>
              <div className="simulation-status">
                Status: {isSimulationRunning ? 
                  <span className="status running">Running</span> : 
                  <span className="status stopped">Stopped</span>
                }
              </div>
              <div className="control-buttons">
                <button className="control-button reset" onClick={reset}>
                  Reset
                </button>
                <button className="control-button start" onClick={startSimulation} disabled={isSimulationRunning}>
                  Start
                </button>
                <button className="control-button stop" onClick={stopSimulation} disabled={!isSimulationRunning}>
                  Stop
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ViewDetail;