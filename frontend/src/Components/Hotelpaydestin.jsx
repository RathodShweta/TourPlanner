import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HotelConfirm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const hotel = state?.hotel;
  const user = state?.user;

  // extract price number from "₹5,500 / night"
  const pricePerNight = Number(
    hotel.price.replace(/[^0-9]/g, "")
  );

  const [travelDate, setTravelDate] = useState("");
  const [days, setDays] = useState(1);

  const totalAmount = pricePerNight * days;

  const handleConfirm = () => {
    if (!travelDate) {
      alert("Please select travel date");
      return;
    }

    const ok = window.confirm(
      "Are you sure you want to proceed to payment?"
    );

    if (ok) {
      navigate("/Hotelpayment", {
        state: {
          hotel,
          user,
          travelDate,
          nights: days,
          totalAmount
        }
      });
    }
  };

  return (
    <div className="container py--1 d-flex justify-content-center">
      {/* 🔳 MAIN BOX */}
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: "420px",
          width: "100%",
          borderRadius: "16px"
        }}
      >
        {/* TITLE */}
        <h4 className="fw-bold text-center mb-4">
          🏨 Confirm Booking Details
        </h4>

        {/* 👤 USER DETAILS */}
        <div className="mb-3">
          <h6 className="fw-bold mb-2">👤 User Details</h6>

          <div className="border rounded p-2 small">
            <p className="mb-1">
              <b>Name:</b> {user?.name}
            </p>
            <p className="mb-0">
              <b>Email:</b> {user?.email}
            </p>
          </div>
        </div>

        {/* 🏨 HOTEL DETAILS */}
        <div className="mb-3">
          <h6 className="fw-bold mb-2">🏨 Hotel Details</h6>

          <div className="border rounded p-2 small">
            <p className="mb-1">
              <b>Hotel:</b> {hotel?.name}
            </p>
            <p className="mb-1">
              <b>Location:</b> {hotel?.location}
            </p>
            <p className="mb-0">
              <b>Price / Night:</b> ₹{pricePerNight}
            </p>
          </div>
        </div>

        {/* 📅 TRAVEL DETAILS */}
        <div className="mb-3">
          <h6 className="fw-bold mb-2">📅 Travel Details</h6>

          <div className="border rounded p-2">
            <label className="form-label small mb-1">
              Travel Date
            </label>
            <input
              type="date"
              className="form-control mb-2"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
            />

            <label className="form-label small mb-1">
              Number of Days
            </label>
            <select
              className="form-select"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={d}>
                  {d} Day{d > 1 && "s"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 💰 TOTAL */}
        <div className="border rounded p-3 text-center mb-3">
          <h5 className="text-primary fw-bold mb-0">
            Total Amount: ₹{totalAmount}
          </h5>
        </div>

        {/* ACTION */}
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

export default HotelConfirm;
