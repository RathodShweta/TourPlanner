import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FlightReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const getSeatKey = (flight) =>
  `FLIGHT_SEATS_${flight.airline}_${flight.time}`;

  const destination = location.state?.destination;
  const flight = location.state?.flight;

  const [journeyDate, setJourneyDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [passenger, setPassenger] = useState({
    name: "",
    email: "",
    mobile: ""
  });

  if (!destination || !flight) {
    return (
      <div className="container text-center mt-5">
        <h5>⚠️ No flight data found</h5>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/Flights")}
        >
          Go Back
        </button>
      </div>
    );
  }

  const TOTAL_SEATS = 60;
  const seatKey = `FLIGHT_SEATS_${flight.airline}_${flight.time}`;
  const bookedSeats =
  Number(localStorage.getItem(seatKey)) || 0;

  const availableSeats = TOTAL_SEATS - bookedSeats;

  const pricePerAdult = Number(
    destination.price.replace(/[^0-9]/g, "")
  );

  const totalAmount = pricePerAdult * adults;

  const handleConfirm = () => {
    if (!journeyDate || !passenger.name || !passenger.email) {
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
        totalAmount
      }
    });
  };

  return (
    <div className="container py-1 d-flex justify-content-center">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "900px", width: "100%", borderRadius: "16px" }}
      >
        <h4 className="fw-bold text-center mb-4">
          ✈️ Details of Flights
        </h4>

        {/* 🔹 TWO COLUMN LAYOUT */}
        <div className="row g-3">

          {/* LEFT SIDE */}
          <div className="col-md-6">

            {/* FLIGHT DETAILS */}
            <div className="mb-3">
              <h6 className="fw-bold">✈️ Flight Details</h6>
              <div className="border rounded p-2 small">
                <p className="mb-1"><b>Airline:</b> {flight.airline}</p>
                <p className="mb-1"><b>Type:</b> {flight.type}</p>
                <p className="mb-1"><b>Departure:</b> {flight.time}</p>
                <p className="mb-0"><b>Duration:</b> {flight.duration}</p>
              </div>
            </div>

            {/* SEAT AVAILABILITY */}
            <div className="mb-3">
              <h6 className="fw-bold">💺 Seat Availability</h6>
              <div className="border rounded p-2 small">
                <p className="mb-1"><b>Total Seats:</b> {TOTAL_SEATS}</p>
                <p className="mb-1 text-danger">
                  <b>Already Booked:</b> {bookedSeats}
                </p>
                <p className="mb-0 text-success">
                  <b>Available Seats:</b> {availableSeats}
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="col-md-6">

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
                  disabled={availableSeats === 0}
                >
                  {Array.from(
                    { length: Math.min(5, availableSeats) },
                    (_, i) => i + 1
                  ).map((n) => (
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
              disabled={availableSeats === 0}
            >
              Confirm & Pay
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightReview;
