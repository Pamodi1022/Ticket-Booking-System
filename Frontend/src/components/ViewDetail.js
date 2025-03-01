import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ViewStyles.css";
import UserNavbar from "./UserNavbar";
import Event from '../assets/event1.jpeg';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, recharts } from 'recharts';

const ViewDetail = () => {
  const [availableTickets, setAvailableTickets] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [soldTickets, setSoldTickets] = useState(0);
  const [maxCapacity, setMaxCapacity] = useState(0);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [systemStatus, setSystemStatus] = useState(0);
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
            const sold = totalTickets - response.data;
            setSoldTickets(sold);
            
            // Update system status - percentage of tickets sold
            const status = Math.round((sold / totalTickets) * 100);
            setSystemStatus(status);
            
            // Add data point to sales chart
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            setSalesData(prevData => {
              // Keep last 8 data points for better visualization
              const newData = [...prevData, { time: timeStr, sold: sold, available: response.data }];
              if (newData.length > 8) return newData.slice(-8);
              return newData;
            });
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
            setSalesData([]);
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
        // Reset sales data for new simulation
        setSalesData([]);
        setSystemStatus(0);
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
        setSalesData([]);
        setSystemStatus(0);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error resetting simulation:", error);
      });
  };

  // Calculate percentage of tickets available (out of max capacity)
  const percentageAvailable = maxCapacity > 0 ? (availableTickets / maxCapacity) * 100 : 0;
  
  // Calculate percentage of sold tickets (out of total tickets)
  const percentageSold = totalTickets > 0 ? (soldTickets / totalTickets) * 100 : 0;
  
  // Calculate circle properties for system status
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - systemStatus / 100);
  const statusColor = systemStatus >= 80 ? "#4CAF50" : systemStatus >= 50 ? "#FFC107" : "#F44336";
  
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
                <div className="ticket-number">{totalTickets}</div>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: "100%", backgroundColor: "#2ecc71" }}
                  ></div>
                </div>
                <div className="progress-label">100% (total capacity)</div>
              </div>
              
              <div className="ticket-card">
                <h2>Sold Tickets</h2>
                <div className="ticket-number">{soldTickets}</div>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: `${percentageSold}%`, backgroundColor: "#e74c3c" }}
                  ></div>
                </div>
                <div className="progress-label">{percentageSold.toFixed(1)}% of total</div>
              </div>
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
          
          <div className="graph-container">
            <div className="graph-card">
              <h2>Ticket Sales Curve</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sold" stroke="#e74c3c" strokeWidth={2} name="Sold Tickets" />
                    <Line type="monotone" dataKey="available" stroke="#3498db" strokeWidth={2} name="Available Tickets" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="graph-card">
              <h2>Ticket System Dynamics</h2>
              <div className="system-status">
                <h3>System Status</h3>
                <div className="circle-progress-container">
                  <svg width="150" height="150" viewBox="0 0 150 150">
                    <circle 
                      cx="75" cy="75" r={radius} 
                      fill="none" 
                      stroke="#f0f0f0" 
                      strokeWidth="10" 
                    />
                    <circle 
                      cx="75" cy="75" r={radius} 
                      fill="none" 
                      stroke={statusColor} 
                      strokeWidth="10" 
                      strokeDasharray={circumference} 
                      strokeDashoffset={dashoffset}
                      transform="rotate(-90 75 75)"
                    />
                    <text x="75" y="70" textAnchor="middle" fontSize="28" fontWeight="bold">{systemStatus}%</text>
                    <text x="75" y="95" textAnchor="middle" fontSize="14">ACTIVE</text>
                  </svg>
                </div>
                
                <div className="ticket-summary">
                  <div className="summary-row">
                    <span>Total Tickets:</span>
                    <span className="summary-value">{totalTickets}</span>
                  </div>
                  <div className="summary-row">
                    <span>Available Tickets:</span>
                    <span className="summary-value">{availableTickets}</span>
                  </div>
                  <div className="summary-row">
                    <span>Sold Tickets:</span>
                    <span className="summary-value">{soldTickets}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ViewDetail;