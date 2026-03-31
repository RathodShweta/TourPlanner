import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./FlightReview.css";

const FlightReview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const destination = location.state?.destination;
  const flight = location.state?.flight;

  const [journeyDate, setJourneyDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [seatType, setSeatType] = useState("Window"); // New: Seat Selection
  const [passenger, setPassenger] = useState({
    name: "",
    email: "",
    mobile: ""
  });

  if (!destination || !flight) {
    return (
      <div className="container text-center mt-5 py-5">
        <div className="card border-0 shadow-sm p-5 rounded-4">
          <i className="fas fa-exclamation-triangle fs-1 text-warning mb-3"></i>
          <h5 className="fw-bold">No flight data found</h5>
          <button className="btn btn-primary mt-3" onClick={() => navigate("/Flights")}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const TOTAL_SEATS = 60;
  const seatKey = `FLIGHT_SEATS_${flight.airline}_${flight.time}`;
  const bookedSeats = Number(localStorage.getItem(seatKey)) || 0;
  const availableSeats = TOTAL_SEATS - bookedSeats;

  const pricePerAdult = Number(destination.price.replace(/[^0-9]/g, ""));
  const totalAmount = pricePerAdult * adults;

  const handleConfirm = () => {
    if (!journeyDate || !passenger.name || !passenger.email || !passenger.mobile) {
      alert("Please fill all required details");
      return;
    }

    if (adults > availableSeats) {
      alert(`Only ${availableSeats} seats available`);
      return;
    }

    navigate("/FlightPayment", {
      state: {
        destination,
        flight,
        passenger,
        journeyDate,
        adults,
        seatType,
        totalAmount
      }
    });
  };

  return (
    <div className="flight-review-wrapper">
      <div className="container">

        {/* UPPER NAVIGATION & TITLE */}
        <div className="row mb-4 align-items-center">
          <div className="col-md-8">
            <h1 className="main-review-title">Checkout</h1>
            <p className="text-muted lead mb-0">Review your journey and secure your booking in one step.</p>
          </div>
          <div className="col-md-4 text-md-end">
            <Link to="/flights" className="btn btn-outline-dark border-2 rounded-pill fw-bold px-4">
              <i className="fas fa-chevron-left me-2"></i> Change Flight
            </Link>
          </div>
        </div>

        <div className="ticket-container">

          {/* 🎫 LEFT SIDE: PREMIUM BOARDING PASS */}
          <div className="flight-ticket-info">
            <div className="ticket-header">
              <h4 className="mb-0">BOARDING SUMMARY</h4>
              <span className="pass-type-badge">{flight.type} CLASS</span>
            </div>

            <div className="ticket-body">
              <div className="airline-brand-box">
                <div className="brand-icon-rounded">✈️</div>
                <div>
                  <h5 className="fw-bold mb-0 text-slate-800">{flight.airline} International</h5>
                  <p className="text-indigo-400 small mb-0 fw-semibold">Operated by TourPlanner</p>
                </div>
              </div>

              <div className="journey-path-display">
                <div className="city-node text-start">
                  <h3>BOM</h3>
                  <p>Mumbai, IN</p>
                </div>
                <div className="flight-path-line mx-4 flex-grow-1">
                  <i className="fas fa-plane"></i>
                </div>
                <div className="city-node text-end">
                  <h3>{destination.name.substring(0, 3).toUpperCase()}</h3>
                  <p>{destination.name}, IN</p>
                </div>
              </div>

              <div className="flight-info-grid-modern">
                <div className="grid-cell">
                  <label>TIME</label>
                  <span>{flight.time || "09:00 AM"}</span>
                </div>
                <div className="grid-cell">
                  <label>DURATION</label>
                  <span>{flight.duration || "2h 30m"}</span>
                </div>
                <div className="grid-cell">
                  <label>AIRCRAFT</label>
                  <span>Airbus A321 Neo</span>
                </div>
                <div className="grid-cell">
                  <label>SERVICE</label>
                  <span>Economy Plus</span>
                </div>
                <div className="grid-cell">
                  <label>GATE</label>
                  <span>Terminal 2, G14</span>
                </div>
                <div className="grid-cell">
                  <label>STATUS</label>
                  <span className="text-success fw-bold">ON TIME</span>
                </div>
              </div>
            </div>
          </div>

          {/* 📝 RIGHT SIDE: CLEAN PASSENGER FORM */}
          <div className="passenger-form-card">
            <div className="form-header-title">
              <i className="fas fa-user-circle"></i>
              <span>Traveler Information</span>
            </div>

            <div className="custom-field-box">
              <label>Full Passenger Name</label>
              <input
                type="text"
                placeholder="Ex: Rathod Shweta"
                value={passenger.name}
                onChange={(e) => setPassenger({ ...passenger, name: e.target.value })}
              />
            </div>

            <div className="row">
              <div className="col-12 col-md-6">
                <div className="custom-field-box">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="shweta@example.com"
                    value={passenger.email}
                    onChange={(e) => setPassenger({ ...passenger, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="custom-field-box">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765-43210"
                    value={passenger.mobile}
                    onChange={(e) => setPassenger({ ...passenger, mobile: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="custom-field-box">
              <label>Number of Adults</label>
              <div className="toggle-group adults-selector">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    className={`toggle-btn ${adults === n ? 'active' : ''}`}
                    onClick={() => setAdults(n)}
                    disabled={availableSeats < n}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6">
                <div className="custom-field-box">
                  <label>Date of Journey</label>
                  <input
                    type="date"
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="custom-field-box">
                  <label>Select Seat Type</label>
                  <div className="toggle-group">
                    {[
                      { id: "Window", icon: "🪟" },
                      { id: "Aisle", icon: "🚶" },
                      { id: "Middle", icon: "🧱" }
                    ].map(seat => (
                      <button
                        key={seat.id}
                        type="button"
                        className={`toggle-btn flex-grow-1 ${seatType === seat.id ? 'active' : ''}`}
                        onClick={() => setSeatType(seat.id)}
                      >
                        {seat.icon} {seat.id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="fare-breakdown-card">
              <div className="fare-item">
                <label>Adult Base Fare ({adults}x)</label>
                <span>₹{pricePerAdult * adults}</span>
              </div>
              <div className="fare-item">
                <label>Taxes & Online Processing</label>
                <span className="text-success">FREE</span>
              </div>
              <div className="fare-total">
                <label>Grand Total</label>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <button
              className="btn-proceed-secure shadow-lg"
              onClick={handleConfirm}
              disabled={availableSeats === 0}
            >
              {availableSeats === 0 ? "FLIGHT FULL" : "Finalize & Secure Payment"}
            </button>
            <div className="text-center mt-4">
              <p className="small text-muted mb-0">
                <i className="fas fa-lock me-2 text-indigo-400"></i>
                256-bit Secure Encrypted Transaction
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightReview;
