import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Hotelpayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const hasStarted = useRef(false);

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
  const [loading, setLoading] = useState(false);

  const downloadReceipt = (transactionId) => {
    const doc = new jsPDF();
    const tId = transactionId || txnId;

    // Header
    doc.setFillColor(30, 41, 59); // Dark blue
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("TourPlanner Receipt", 105, 25, { align: "center" });

    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Hotel Booking Confirmation", 15, 55);
    doc.setFont("helvetica", "normal");
    doc.text(`Booking ID: ${tId}`, 150, 55);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 62);

    const tableData = [
      ["Customer Name", user?.name],
      ["Email Address", user?.email],
      ["Hotel Name", hotel?.name],
      ["Check-in Date", travelDate],
      ["Stay Duration", `${nights} Night(s)`],
      ["Rooms/Seats", selectedSeats?.join(", ")],
      ["Total Amount", `INR ${totalAmount}`]
    ];

    autoTable(doc, {
      startY: 70,
      head: [["Detail", "Information"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 5 }
    });

    const finalY = doc.lastAutoTable.finalY + 20;
    doc.text("Thank you for choosing TourPlanner!", 105, finalY, { align: "center" });

    doc.save(`Hotel_Booking_${tId}.pdf`);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Direct booking simulation
      const transactionId = "TXN_" + Math.random().toString(36).substr(2, 9).toUpperCase();
      setTxnId(transactionId);
      setStatus("success");

      // Save Booking to Database
      await axios.post("http://localhost:5000/api/hotel-bookings", {
        hotelId: hotel._id,
        userId: user.id,
        travelDate,
        nights,
        seats: selectedSeats,
        totalAmount,
        transactionId
      });

      // Send Confirmation Email
      await axios.post("http://localhost:5000/api/bookings/send-confirmation", {
        email: user?.email,
        name: user?.name,
        type: "hotel",
        bookingDetails: {
          "Booking ID": transactionId,
          "Customer Name": user?.name,
          "Hotel Name": hotel?.name,
          "Check-in Date": travelDate,
          "Stay Duration": nights + " Night(s)",
          "Rooms/Seats": selectedSeats?.join(", "),
          "Total Amount": "INR " + totalAmount
        }
      });

      setLoading(false);
    } catch (err) {
      console.error("Booking failed", err);
      setStatus("failed");
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!state) {
      navigate("/hotels");
    }
  }, [state, navigate]);

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%", borderRadius: "15px" }}>
        <h5 className="fw-bold text-center mb-4">
          🏨 Hotel Payment Summary
        </h5>

        <div className="booking-summary mb-4">
          <p className="mb-1"><b>Name:</b> {user?.name}</p>
          <p className="mb-1"><b>Email:</b> {user?.email}</p>
          <hr />
          <p className="mb-1"><b>Hotel:</b> {hotel?.name}</p>
          <p className="mb-1"><b>Check-in:</b> {travelDate}</p>
          <p className="mb-1"><b>Duration:</b> {nights} Night(s)</p>
          <p className="mb-1"><b>Rooms/Seats:</b> {selectedSeats?.join(", ")}</p>
          <div className="mt-3 p-3 bg-light rounded text-center">
            <span className="text-muted small d-block">TOTAL PAYABLE</span>
            <h4 className="fw-bold text-primary mb-0">₹{totalAmount}</h4>
          </div>
        </div>

        {/* ⏳ PENDING */}
        {status === "pending" && (
          <div className="text-center">
            <div className="mb-4 p-3 border rounded bg-white shadow-sm">
              <h6 className="fw-bold mb-3 text-secondary">Scan to Pay with Any UPI App</h6>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi%3A%2F%2Fpay%3Fpa%3Dtourplanner%40ybl%26pn%3DTourPlanner%26am%3D${totalAmount}%26cu%3DINR`} 
                alt="Payment QR Code" 
                className="img-fluid border p-2 rounded" 
                style={{ width: '150px', height: '150px' }}
              />
              <div className="mt-3 text-muted small">
                <i className="fas fa-mobile-alt me-1"></i> GPay, PhonePe, Paytm accepted
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg w-100 mb-3 shadow-sm"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Processing...
                </>
              ) : (
                "I have completed the payment"
              )}
            </button>
            <p className="small text-muted"> <i className="fas fa-lock me-1"></i> Secure Encrypted Payment</p>
          </div>
        )}

        {/* ✅ SUCCESS */}
        {status === "success" && (
          <div className="text-center">
            <div className="alert alert-success py-3 mb-4">
              <i className="fas fa-check-circle fa-2x mb-2 d-block"></i>
              <h5 className="alert-heading fw-bold">Payment Successful!</h5>
              <p className="mb-0 small">Transaction ID: {txnId}</p>
            </div>

            <button
              onClick={() => downloadReceipt()}
              className="btn btn-warning w-100 mb-2 text-white fw-bold"
            >
              <i className="fas fa-file-pdf me-2"></i> Download Receipt
            </button>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScumjRuWOFv97nyPT6qdplIBX1z4PNcb7Oylbd9jMnpDyIknA/viewform?usp=sf_link"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary w-100 mb-2"
            >
              <i className="fas fa-star me-2"></i> Share Feedback
            </a>
          </div>
        )}

        {/* ❌ FAILED */}
        {status === "failed" && (
          <div className="alert alert-danger text-center">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Payment Verification Failed. Please contact support.
          </div>
        )}

        <button
          className="btn btn-dark w-100 mt-2"
          onClick={() => navigate("/HotelBooking")}
        >
          View Booking History
        </button>
      </div>
    </div>
  );
};

export default Hotelpayment;
