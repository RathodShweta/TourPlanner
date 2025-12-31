import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Flights = () => {
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
    <div className="flights-dashboard">
      {/* SIDEBAR: All Destinations List */}
      <div className="dest-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="text-decoration-none text-white">← Home</Link>
          <h5 className="mt-2 fw-bold">Destinations</h5>
        </div>
        <div className="dest-list">
          {destinations.map((dest, idx) => (
            <div 
              key={idx} 
              className={`dest-item ${activeDest.name === dest.name ? "active" : ""}`}
              onClick={() => setActiveDest(dest)}
            >
              <span className="dest-icon-small">{dest.icon}</span>
              <div className="dest-info">
                <div className="dest-name-small">{dest.name}</div>
                <div className="dest-type-small">{dest.type}</div>
              </div>
              <div className="dest-price-tag">{dest.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT: Flight Details */}
      <div className="flight-main-content">
        <div className="flight-header">
          <h2>Flights to {activeDest.name} {activeDest.icon}</h2>
          <p className="text-muted">Showing fastest and cheapest flights for your journey.</p>
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
              <div className="flight-action">
                <button className="btn btn-warning fw-bold text-white px-4">Book</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Flights;