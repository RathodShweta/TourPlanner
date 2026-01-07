import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Paymntdetaildesti = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const place = state?.place;
  const user = JSON.parse(localStorage.getItem("user")); // ✅ USER DATA

  const [travelDate, setTravelDate] = useState("");
  const [days, setDays] = useState(1);

  if (!place) {
    return <h3 className="text-center mt-5">No destination selected</h3>;
  }

  const basePrice =
    Number(String(place.price).replace(/[^0-9]/g, "")) || 0;

  const totalAmount = basePrice * days;
  const today = new Date().toISOString().split("T")[0];

  const handleConfirm = () => {
    if (!travelDate) {
      alert("Please select travel date");
      return;
    }

    const ok = window.confirm(
      `Confirm Booking 👇

Name: ${user?.name || "Guest"}
Email: ${user?.email || "Not available"}

Destination: ${place.name}
Date: ${travelDate}
Days: ${days}
Total Amount: ₹${totalAmount}
`
    );

    if (ok) {
      navigate("/Paymentdesti", {
        state: {
          place,
          travelDate,
          days,
          totalAmount,
          user
        }
      });
    }
  };

  return (
    <div className="container py-1">
      <h2 className="text-center fw-bold mb-4">Payment Details</h2>

      <div className="card p-4 shadow mx-auto" style={{ maxWidth: "500px" }}>

        {/* USER DETAILS */}
        <h5 className="fw-bold mb-2">👤 User Details</h5>
        <p><strong>Name:</strong> {user?.name || "Guest"}</p>
        <p><strong>Email:</strong> {user?.email || "Not available"}</p>

        <hr />

        {/* TRIP DETAILS */}
        <h5 className="fw-bold mb-2">📍 Trip Details</h5>
        <p><strong>Destination:</strong> {place.name}</p>
        <p><strong>Price per day:</strong> ₹{basePrice}</p>

        <label className="fw-bold mt-2">Travel Date</label>
        <input
          type="date"
          className="form-control mb-3"
          min={today}
          value={travelDate}
          onChange={(e) => setTravelDate(e.target.value)}
        />

        <label className="fw-bold">Number of Days</label>
        <select
          className="form-select mb-3"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} Day{i + 1 > 1 ? "s" : ""}
            </option>
          ))}
        </select>

        <h5 className="text-success text-center">
          Total Amount: ₹{totalAmount}
        </h5>

        <button
          className="btn btn-success w-100 mt-3 fw-bold"
          onClick={handleConfirm}
        >
          Confirm & Pay
        </button>
      </div>
    </div>
  );
};

export default Paymntdetaildesti;
