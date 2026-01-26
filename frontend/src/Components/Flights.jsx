import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const Flights = () => {
  const navigate = useNavigate(); 
  // All Destinations
  const destinations = [
    { name: "Manali", type: "Hill Station", icon: "⛰️", price: "₹4,500" },
    { name: "Shimla", type: "Hill Station", icon: "❄️", price: "₹3,800" },
    { name: "Darjeeling", type: "Hill Station", icon: "🍃", price: "₹5,100" },
    { name: "Goa", type: "Beach", icon: "🏖️", price: "₹6,200" },
    { name: "Andaman", type: "Island", icon: "🏝️", price: "₹8,500" },
    { name: "Varanasi", type: "Spiritual", icon: "🛕", price: "₹3,200" },
    { name: "Golden Temple", type: "Spiritual", icon: "✨", price: "₹3,500" },
    { name: "Taj Mahal", type: "Heritage", icon: "🕌", price: "₹2,800" },
    { name: "Hampi", type: "Heritage", icon: "🏛️", price: "₹4,900" },
    { name: "Jim Corbett", type: "Wildlife", icon: "🐅", price: "₹5,500" },
    { name: "Udaipur", type: "Nature", icon: "🌅", price: "₹5,300" },
    { name: "Alleppey", type: "Nature", icon: "🛶", price: "₹6,000" },
  ];

  const [activeDest, setActiveDest] = useState(destinations[0]);

  // Mock flight list for the active destination
  const flightResults = [
    { id: 1, airline: "IndiGo", time: "09:00 AM", duration: "2h 10m", type: "Non-stop" },
    { id: 2, airline: "Air India", time: "12:45 PM", duration: "2h 30m", type: "1 Stop" },
    { id: 3, airline: "Vistara", time: "04:20 PM", duration: "2h 05m", type: "Non-stop" },
    { id: 4, airline: "SpiceJet", time: "08:55 PM", duration: "2h 15m", type: "Non-stop" },
  ];

  return (
    <div className="flights-page-container">
      {/* HEADER with Destination Selector */}
      <div className="flights-header-section">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h2 className="fw-bold mb-0">Flight Bookings</h2>
            <Link to="/" className="btn btn-outline-dark">← Home</Link>
          </div>
          
          {/* Destination Selector Dropdown */}
          <div className="destination-selector-wrapper">
            <label className="form-label fw-bold mb-2">Select Destination</label>
            <select 
              className="form-select destination-select"
              value={activeDest.name}
              onChange={(e) => {
                const selected = destinations.find(d => d.name === e.target.value);
                setActiveDest(selected);
              }}
            >
              {destinations.map((dest, idx) => (
                <option key={idx} value={dest.name}>
                  {dest.icon} {dest.name} - {dest.type} ({dest.price})
                </option>
              ))}
            </select>
            
            {/* Selected Destination Info Card */}
            <div className="selected-dest-card mt-3">
              <div className="d-flex align-items-center gap-3">
                <span className="dest-icon-large">{activeDest.icon}</span>
                <div className="flex-grow-1">
                  <h4 className="mb-1 fw-bold">{activeDest.name}</h4>
                  <p className="mb-0 text-muted small">{activeDest.type}</p>
                </div>
                <div className="text-end">
                  <div className="h4 mb-0 fw-bold text-success">{activeDest.price}</div>
                  <small className="text-muted">Starting Price</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT: Flight Details */}
      <div className="flight-main-content container">
        <div className="flight-results-header mb-4">
          <h3 className="fw-bold">Available Flights</h3>
          <p className="text-muted mb-0">Showing fastest and cheapest flights for your journey</p>
        </div>

        <div className="flight-results-grid">
          {flightResults.map((flight) => (
            <div key={flight.id} className="flight-strip">
              <div className="airline-brand">
                <div className="airline-logo-box">✈️</div>
                <div>
                  <div className="fw-bold">{flight.airline}</div>
                  <small className="text-muted">{flight.type}</small>
                </div>
              </div>
              <div className="flight-timing">
                <div className="h5 mb-0">{flight.time}</div>
                <small className="text-muted">Departure</small>
              </div>
              <div className="flight-duration">
                <div className="duration-line"></div>
                <small>{flight.duration}</small>
              </div>
              <div className="flight-price">
                <div className="h4 mb-0 fw-bold text-success">{activeDest.price}</div>
                <small className="text-muted">Per Adult</small>
              </div>
              <button
                className="btn btn-warning fw-bold text-white px-4"
                onClick={() =>
                  navigate("/FlightReview", {
                    state: {
                      destination: activeDest,
                      flight
                    }
                  })
                }
              >
                Book
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Flights;