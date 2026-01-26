import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const STORAGE_KEY = "HotelBooking";

const Hotelpayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    hotel,
    user,
    travelDate,
    nights,
    totalAmount,
    selectedSeats
  } = state || {};

  const [status, setStatus] = useState("pending");
  const [txnId, setTxnId] = useState("");

  const startPayment = () => {
    setStatus("pending");
    setTxnId("");

    setTimeout(async () => {
      const transactionId = "TXN" + Date.now();

      // ✅ AUTO SUCCESS
      setTxnId(transactionId);
      setStatus("success");

      try {
        // ✅ SAVE BOOKING IN BACKEND
        await axios.post("http://localhost:5000/api/hotel-bookings", {
          hotelId: hotel._id,
          userId: user.id, // ✅ FIXED
          travelDate,
          nights,
          seats: selectedSeats,
          totalAmount,
          transactionId
        });
      } catch (err) {
        console.error("Booking save failed", err);
      }
    }, 5000);
  };

  useEffect(() => {
    startPayment();
  }, []);

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div
        className="card shadow-lg p-4 responsive-card"
      >
        <h5 className="fw-bold text-center mb-3">
          🧾 Payment Receipt
        </h5>

        <p><b>Name:</b> {user?.name}</p>
        <p><b>Email:</b> {user?.email}</p>
        <p><b>Hotel:</b> {hotel?.name}</p>
        <p><b>Date:</b> {travelDate}</p>
        <p><b>Nights:</b> {nights}</p>
        <p><b>Seats:</b> {selectedSeats?.join(", ")}</p>

        <p className="fw-bold text-success">
          Amount: ₹{totalAmount}
        </p>

        {/* ⏳ PENDING */}
        {status === "pending" && (
          <div className="text-center my-3">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=UPI"
              alt="QR"
            />
            <p className="small text-muted mt-2">
              Waiting for payment confirmation...
            </p>
            <div className="spinner-border spinner-border-sm text-primary"></div>
          </div>
        )}

        {/* ✅ SUCCESS */}
        {status === "success" && (
          <div className="alert alert-success text-center my-3">
            ✅ Payment Successful
            <div className="small">Txn ID: {txnId}</div>
          </div>
        )}

        <button
          className="btn btn-dark w-100 mt-2"
          onClick={() => navigate("/hotelbooking")}
        >
          View Booking History
        </button>
      </div>
    </div>
  );
};

export default Hotelpayment;
