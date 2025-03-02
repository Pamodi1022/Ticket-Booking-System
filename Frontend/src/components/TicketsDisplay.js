import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ViewStyles.css";
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

  const percentageAvailable = maxCapacity === 0 ? 0 : Math.min((availableTickets / maxCapacity) * 100, 100);
  const percentageTotal = initialTotalTickets === 0 ? 0 : Math.min((totalTickets / initialTotalTickets) * 100, 100);
  const percentageSold = initialTotalTickets === 0 ? 0 : Math.min((soldTickets / initialTotalTickets) * 100, 100);
  
  return (
    <div>
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
              <div className="progress-label">{percentageAvailable.toFixed(1)}% of capacity</div>
            </div>
            
            <div className="ticket-card">
              <h2>Total Tickets</h2>
              <div className="ticket-number">{totalTickets}</div>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${percentageTotal}%`, backgroundColor: "#7c0914" }}
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
                  style={{ width: `${percentageSold}%`, backgroundColor: "#110556" }}
                ></div>
              </div>
              <div className="progress-label">{percentageSold.toFixed(1)}% of sold</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetail;