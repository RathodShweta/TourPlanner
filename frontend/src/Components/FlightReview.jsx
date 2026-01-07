import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FlightReview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { destination, flight } = state;

  const pricePerAdult = Number(
    destination.price.replace(/[^0-9]/g, "")
  );

  const [journeyDate, setJourneyDate] = useState("");
  const [adults, setAdults] = useState(1);

  const [passenger, setPassenger] = useState({
    name: "",
    email: "",
    mobile: ""
  });

  const totalAmount = pricePerAdult * adults;

  const handleConfirm = () => {
    if (!journeyDate || !passenger.name || !passenger.email) {
      alert("Please fill all required details");
      return;
    }

    const ok = window.confirm(
      "Are you sure you want to proceed to payment?"
    );

    if (ok) {
      navigate("/FlightPayment", {
        state: {
          destination,
          flight,
          passenger,
          journeyDate,
          adults,
          totalAmount
        }
      });
    }
  };

  return (
    <div className="container py-0 d-flex justify-content-center">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "420px", width: "100%", borderRadius: "16px" }}
      >
        <h4 className="fw-bold text-center mb-4">
          ✈️ Review Your Flight
        </h4>

        {/* FLIGHT DETAILS */}
        <div className="mb-3">
          <h6 className="fw-bold">✈️ Flight Details</h6>
          <div className="border rounded p-2 small">
            <p className="mb-1">
              <b>Airline:</b> {flight.airline}
            </p>
            <p className="mb-1">
              <b>Type:</b> {flight.type}
            </p>
            <p className="mb-1">
              <b>Departure:</b> {flight.time}
            </p>
            <p className="mb-0">
              <b>Duration:</b> {flight.duration}
            </p>
          </div>
        </div>

        {/* PASSENGER DETAILS */}
        <div className="mb-3">
          <h6 className="fw-bold">👤 Passenger Details</h6>
          <div className="border rounded p-2">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Full Name"
              value={passenger.name}
              onChange={(e) =>
                setPassenger({ ...passenger, name: e.target.value })
              }
            />
            <input
              type="email"
              className="form-control mb-2"
              placeholder="Email"
              value={passenger.email}
              onChange={(e) =>
                setPassenger({ ...passenger, email: e.target.value })
              }
            />
            <input
              type="tel"
              className="form-control"
              placeholder="Mobile Number"
              value={passenger.mobile}
              onChange={(e) =>
                setPassenger({ ...passenger, mobile: e.target.value })
              }
            />
          </div>
        </div>

        {/* TRAVEL DETAILS */}
        <div className="mb-3">
          <h6 className="fw-bold">🧳 Travel Details</h6>
          <div className="border rounded p-2">
            <label className="form-label small">Journey Date</label>
            <input
              type="date"
              className="form-control mb-2"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
            />

            <label className="form-label small">Adults</label>
            <select
              className="form-select"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} Adult{n > 1 && "s"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FARE SUMMARY */}
        <div className="border rounded p-3 text-center mb-3">
          <p className="mb-1">
            Price per Adult: ₹{pricePerAdult}
          </p>
          <h5 className="fw-bold text-primary mb-0">
            Total Amount: ₹{totalAmount}
          </h5>
        </div>

        <button
          className="btn btn-success w-100 fw-bold"
          onClick={handleConfirm}
        >
          Confirm & Pay
        </button>
      </div>
    </div>
  );
};

export default FlightReview;
