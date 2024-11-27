import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TicketManagementForm() {
  const [formData, setFormData] = useState({
    totalTickets: '',
    maxCapacity: '',
    releaseRate: '',
    retrievalRate: '',
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    navigate('/Vendor');
  };

  return (
    <div className="ticket-management-form">
      <div className="ticket-form-container">
        <h2 className="ticket-title">Ticket Management Form</h2>
        <p className="ticket-description">Please enter the details to manage ticketing capacity and release rates.</p>
        <form onSubmit={handleSubmit}>
          <div className="ticket-form-group">
            <label>Total Tickets:</label>
            <input
              className="ticket-input-field"
              type="number"
              name="totalTickets"
              value={formData.totalTickets}
              onChange={handleChange}
              required
            />
          </div>

          <div className="ticket-form-group">
            <label>Maximum Ticket Capacity:</label>
            <input
              className="ticket-input-field"
              type="number"
              name="maxCapacity"
              value={formData.maxCapacity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="ticket-form-group">
            <label>Ticket Release Rate (per hour):</label>
            <input
              className="ticket-input-field"
              type="number"
              name="releaseRate"
              value={formData.releaseRate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="ticket-form-group">
            <label>Customer Retrieval Rate (per hour):</label>
            <input
              className="ticket-input-field"
              type="number"
              name="retrievalRate"
              value={formData.retrievalRate}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="ticket-submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default TicketManagementForm;
