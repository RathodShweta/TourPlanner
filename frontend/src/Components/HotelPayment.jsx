import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const STORAGE_KEY = "HotelBooking";

const Hotelpayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { hotel, user, travelDate, nights, totalAmount } = state;

  const [status, setStatus] = useState("pending"); 
  // pending | success | failed
  const [txnId, setTxnId] = useState("");

  // 🔒 Backend simulation (admin decides)
  const backendCheck = async () => {
    try {
      const res = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            approved: false, // 👉 change to true for success
            transactionId: "TXN" + Date.now()
          });
        }, 1000);
      });
      return res;
    } catch {
      return null;
    }
  };

  const startPayment = async () => {
    setStatus("pending");
    setTxnId("");

    // ⏳ show QR for 5–6 seconds
    setTimeout(async () => {
      const response = await backendCheck();

      const finalStatus =
        response && response.approved === true
          ? "success"
          : "failed";

      const transactionId =
        response?.transactionId || "TXN" + Date.now();

      setTxnId(transactionId);
      setStatus(finalStatus);

      // ✅ SAVE BOTH SUCCESS & FAILED
      const booking = {
        id: transactionId,
        hotel,
        user,
        travelDate,
        nights,
        totalAmount,
        status: finalStatus,
        dateTime: new Date().toLocaleString()
      };

      const prev =
        JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...prev, booking])
      );
    }, 5500); // 5.5 sec delay
  };

  // auto start when page loads
  useEffect(() => {
    startPayment();
  }, []);

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div
        className="card shadow-lg p-4"
        style={{ width: "380px", borderRadius: "16px" }}
      >
        <h5 className="fw-bold text-center mb-3">
          🧾 Payment Receipt
        </h5>

        {/* DETAILS */}
        <p><b>Name:</b> {user?.name}</p>
        <p><b>Email:</b> {user?.email}</p>
        <p><b>Hotel:</b> {hotel?.name}</p>
        <p><b>Travel Date:</b> {travelDate}</p>
        <p><b>Days:</b> {nights}</p>
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
            <p className="text-muted small mt-2">
              Waiting for payment confirmation...
            </p>
            <div className="spinner-border spinner-border-sm text-primary"></div>
          </div>
        )}

        {/* ❌ FAILED */}
        {status === "failed" && (
          <div className="my-3">
            <div className="alert alert-danger text-center">
              ❌ Payment Failed
            </div>
            <button
              className="btn btn-warning w-100"
              onClick={startPayment}
            >
              Retry Payment
            </button>
          </div>
        )}

        {/* ✅ SUCCESS */}
        {status === "success" && (
          <div className="alert alert-success text-center my-3">
            ✅ Payment Successful
            <div className="small">Txn ID: {txnId}</div>
          </div>
        )}

        {/* ALWAYS VISIBLE */}
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
