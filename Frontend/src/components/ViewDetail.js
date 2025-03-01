import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ViewStyles.css";
import UserNavbar from "./UserNavbar";
import Event from '../assets/event1.jpeg';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ViewDetail = () => {
  const [availableTickets, setAvailableTickets] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [soldTickets, setSoldTickets] = useState(0);
  const [maxCapacity, setMaxCapacity] = useState(0);
  const [initialTotalTickets, setinitialTotalTickets] = useState(0);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [systemStatus, setSystemStatus] = useState(0);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:8080/api/tickets",
    timeout: 5000
  });

  // Define calculateSystemStatus function outside of fetchAllTicketData
  const calculateSystemStatus = (sold, initial, available, maxCapacity) => {
    const soldPercentage = (sold / initial) * 100;
    const availablePercentage = (available / maxCapacity) * 100;

    const status = (
      (soldPercentage * 0.5) + // Sold tickets contribute 50%
      (availablePercentage * 0.3) // Available tickets contribute 30%
    );

    return Math.min(Math.round(status), 100);
  };

  const fetchAllTicketData = async () => {
    try {
      const [availableRes, totalRes, soldRes, initialRes, maxRes] = await Promise.all([
        api.get("/available"),
        api.get("/total"),
        api.get("/sold"),
        api.get("/initial"),
        api.get("/max")
      ]);

      const available = availableRes.data;
      const total = totalRes.data;
      const sold = soldRes.data;
      const initial = initialRes.data;
      const max = maxRes.data;

      setAvailableTickets(available);
      setTotalTickets(total);
      setSoldTickets(sold);
      setMaxCapacity(max);
      setinitialTotalTickets(initial);

      // Calculate system status using the calculateSystemStatus function
      const status = calculateSystemStatus(sold, initial, available, max);
      setSystemStatus(status);

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setSalesData(prevData => {
        const newData = [...prevData, { 
          time: timeStr, 
          sold: sold, 
          available: available, 
          total: total,
          initial: initial
        }];
        
        return newData.length > 8 ? newData.slice(-8) : newData;
      });
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };

  useEffect(() => {
    fetchAllTicketData();
    const interval = setInterval(fetchAllTicketData, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkSimulationStatus = async () => {
      try {
        const response = await api.get("/simulation-status");
        setIsSimulationRunning(response.data.running);
      } catch (error) {
        const prevSold = soldTickets;
        setTimeout(() => {
          if (soldTickets > prevSold) {
            setIsSimulationRunning(true);
          }
        }, 2000);
      }
    };

    checkSimulationStatus();
    const interval = setInterval(checkSimulationStatus, 5000);
    return () => clearInterval(interval);
  }, [soldTickets]);

  const startSimulation = async () => {
    try {
      await api.post("/start");
      setIsSimulationRunning(true);
      setSalesData([]);
      setSystemStatus(0);
    } catch (error) {
      console.error("Error starting simulation:", error);
    }
  };

  const stopSimulation = async () => {
    try {
      await api.post("/stop");
      setIsSimulationRunning(false);
    } catch (error) {
      console.error("Error stopping simulation:", error);
    }
  };

  const reset = async () => {
    try {
      await api.post("/reset");
      setIsSimulationRunning(false);
      setSalesData([]);
      setSystemStatus(0);
      setinitialTotalTickets(0);
      navigate("/");
    } catch (error) {
      console.error("Error resetting simulation:", error);
    }
  };

  const percentageAvailable = Math.min((availableTickets / maxCapacity) * 100, 100);
  const percentageTotal = Math.min((totalTickets / initialTotalTickets) * 100, 100);
  const percentageSold = Math.min((soldTickets / initialTotalTickets) * 100, 100);

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
                  style={{ width: `${Math.min(percentageAvailable, 100)}%`, backgroundColor: "#3498db" }}
                ></div>
              </div>
              <div className="progress-label">{percentageAvailable.toFixed(1)}% of capacity</div>
            </div>
            
            <div className="ticket-card">
              <h2>Total Tickets</h2>
              <div className="ticket-number">{totalTickets}</div>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${Math.min(percentageTotal, 100)}%`, backgroundColor: "#e74c3c" }}
                ></div>
              </div>
              <div className="progress-label">{percentageTotal.toFixed(1)}% of total</div>
            </div>
            
            <div className="ticket-card">
              <h2>Sold Tickets</h2>
              <div className="ticket-number">{soldTickets}</div>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${Math.min(percentageSold, 100)}%`, backgroundColor: "#e74c3c" }}
                ></div>
              </div>
              <div className="progress-label">{percentageSold.toFixed(1)}% of sold</div>
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
                  <Line type="monotone" dataKey="total" stroke="#2ecc71" strokeWidth={2} name="Total Tickets" />
                  <Line type="monotone" dataKey="initial" stroke="#2eccd1" strokeWidth={2} name="Initial Tickets" />
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