import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const STORAGE_KEY = "DestinationBooking";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const place = state?.place;
  const totalAmount = state?.totalAmount;
  const days = state?.days;
  const travelDate = state?.travelDate;
  const user = state?.user;

  const [step, setStep] = useState("scanner"); // scanner | loading | result
  const [paymentResult, setPaymentResult] = useState(null);

  // ✅ Unique Transaction ID
  const transactionId = useRef("TXN" + Date.now()).current;

  // ✅ Save Booking History
  const saveBookingHistory = (status) => {
    const previous =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const newBooking = {
      id: transactionId,
      user,
      place,
      travelDate,
      days,
      totalAmount,
      status,
      dateTime: new Date().toLocaleString()
    };

    previous.push(newBooking);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(previous)
    );
  };

  // ✅ PAYMENT FLOW
  useEffect(() => {
    let timer;

    if (step === "scanner") {
      timer = setTimeout(() => setStep("loading"), 4000);
    }

    if (step === "loading") {
      timer = setTimeout(async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/payment",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user,
                place,
                travelDate,
                days,
                totalAmount,
                transactionId
              })
            }
          );

          const data = await response.json();

          if (data.success) {
            setPaymentResult("success");
            saveBookingHistory("success");
          } else {
            setPaymentResult("failed");
            saveBookingHistory("failed");
          }
        } catch (error) {
          console.error("Payment error:", error);
          setPaymentResult("failed");
          saveBookingHistory("failed");
        }

        setStep("result");
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [step]);

  // ❌ Safety check
  if (!place || !totalAmount) {
    return (
      <h3 className="text-center mt-5">
        No booking data found
      </h3>
    );
  }

  const handleRetry = () => {
    setStep("scanner");
    setPaymentResult(null);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="container py-4 d-flex justify-content-center">
      <div
        className="card shadow-lg print-area"
        style={{ width: "420px", borderRadius: "16px" }}
      >
        <div className="card-body">
          <h4 className="fw-bold text-center mb-3">
            🧾 Payment Receipt
          </h4>

          <h6>👤 User Details</h6>
          <p className="mb-1">
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>

          <hr />

          <h6>📍 Trip Details</h6>
          <p><strong>Destination:</strong> {place.name}</p>
          <p><strong>Travel Date:</strong> {travelDate}</p>
          <p><strong>Days:</strong> {days}</p>

          <hr />

          <h6>💳 Payment Details</h6>
          <p><strong>Transaction ID:</strong> {transactionId}</p>
          <p className="fw-bold text-success">
            Total Amount: ₹{totalAmount}
          </p>

          {/* QR */}
          {step === "scanner" && (
            <div className="text-center my-3">
              <p className="fw-bold">Scan to Pay</p>
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=TourPlanner"
                alt="QR"
              />
            </div>
          )}

          {/* Loading */}
          {step === "loading" && (
            <div className="text-center">
              <div className="spinner-border text-warning" />
              <p className="fw-bold text-warning mt-2">
                Processing payment...
              </p>
            </div>
          )}

          {/* Success */}
          {step === "result" && paymentResult === "success" && (
            <>
              <div className="alert alert-success text-center fw-bold">
                ✅ Payment Successful
              </div>

              <button
                className="btn btn-outline-success w-100 mb-2"
                onClick={handleDownloadPDF}
              >
                ⬇ Download Receipt
              </button>

              <button
                className="btn btn-dark w-100 mb-2"
                onClick={() => navigate("/DestinationBooking")}
              >
                View Booking History
              </button>

              <button
                className="btn btn-secondary w-100"
                onClick={() => navigate("/")}
              >
                Back to Home
              </button>
            </>
          )}

          {/* Failed */}
          {step === "result" && paymentResult === "failed" && (
            <>
              <div className="alert alert-danger text-center fw-bold">
                ❌ Payment Failed
              </div>

              <button
                className="btn btn-warning w-100 mb-2"
                onClick={handleRetry}
              >
                Retry Payment
              </button>

              <button
                className="btn btn-dark w-100"
                onClick={() => navigate("/DestinationBooking")}
              >
                View Booking History
              </button>
            </>
          )}
        </div>
      </div>

      {/* Print Style */}
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Payment;
