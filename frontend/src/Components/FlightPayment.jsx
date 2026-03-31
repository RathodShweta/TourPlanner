import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./FlightPayment.css";

const STORAGE_KEY = "FlightBooking";

const FlightPayment = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const {
        destination,
        flight,
        passenger,
        journeyDate,
        adults,
        seatType,
        totalAmount
    } = state || {};

    const [status, setStatus] = useState("pending"); // pending | verifying | success
    const [txnId, setTxnId] = useState("");
    const [loading, setLoading] = useState(false);

    // 📄 PDF Receipt Generator & Printer
    const downloadReceipt = useCallback((currentTxnId, autoPrint = false) => {
        const doc = new jsPDF();
        const tId = currentTxnId || txnId;

        // Header
        doc.setFillColor(30, 41, 59); // Dark blue
        doc.rect(0, 0, 210, 40, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text("TourPlanner Receipt", 105, 25, { align: "center" });

        // Content Styling
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);

        doc.setFont("helvetica", "bold");
        doc.text("Booking Confirmation", 15, 55);
        doc.setFont("helvetica", "normal");

        doc.text(`Booking ID: ${tId}`, 150, 55);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 62);

        // Grid of details
        const tableData = [
            ["Passenger Name", passenger?.name],
            ["Email Address", passenger?.email],
            ["Destination", `${destination?.name}, ${destination?.state || ""}`],
            ["Airline", flight?.airline],
            ["Flight No", "TP-" + (flight?.airline?.substring(0, 2).toUpperCase() || "FL") + "102"],
            ["Journey Date", journeyDate],
            ["Departure Time", flight?.time],
            ["Seat Preference", seatType],
            ["Adults", adults?.toString()],
            ["Total Paid", "INR " + totalAmount]
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
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Thank you for choosing TourPlanner! Have a safe and happy journey.", 105, finalY, { align: "center" });
        doc.text("Please present this receipt at the airport check-in counter.", 105, finalY + 7, { align: "center" });

        doc.setDrawColor(79, 70, 229);
        doc.setLineWidth(1);
        doc.rect(140, finalY + 15, 50, 20);
        doc.setTextColor(79, 70, 229);
        doc.setFontSize(14);
        doc.text("CONFIRMED", 165, finalY + 28, { align: "center" });

        if (autoPrint) {
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
        }

        doc.save(`TourPlanner_Booking_${tId}.pdf`);
    }, [txnId, destination, flight, passenger, journeyDate, adults, seatType, totalAmount]);

    const handleSimulatePayment = () => {
        setLoading(true);
        setStatus("verifying");

        setTimeout(() => {
            const transactionId = "TP-AIR-" + Math.random().toString(36).substr(2, 9).toUpperCase();
            setTxnId(transactionId);

            const booking = {
                id: transactionId,
                destination,
                flight,
                passenger,
                journeyDate,
                adults,
                seatType,
                totalAmount,
                status: "success",
                dateTime: new Date().toLocaleString()
            };

            const prev = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...prev, booking]));

            setStatus("success");
            setLoading(false);

            // ✅ Save to Backend Database
            const token = localStorage.getItem("token");
            if (token) {
                fetch("http://localhost:5000/api/flight-bookings", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        destinationName: destination?.name,
                        airline: flight?.airline,
                        passengerName: passenger?.name,
                        passengerEmail: passenger?.email,
                        journeyDate,
                        departureTime: flight?.time,
                        seatType,
                        adults,
                        totalAmount,
                        transactionId
                    })
                }).catch(err => console.error("DB Save Error:", err));
            }

            // 📧 Send confirmation email with PDF attachment
            fetch("http://localhost:5000/api/bookings/send-confirmation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: passenger?.email,
                    name: passenger?.name,
                    type: "flight",
                    bookingDetails: {
                        "Booking ID": transactionId,
                        "Passenger Name": passenger?.name,
                        "Airline": flight?.airline,
                        "Destination": destination?.name,
                        "Journey Date": journeyDate,
                        "Seat Type": seatType,
                        "Total Paid": "INR " + totalAmount
                    }
                })
            }).catch(err => console.error("Email send error:", err));

            setTimeout(() => {
                downloadReceipt(transactionId, true);
            }, 1000);

        }, 3000);
    };

    useEffect(() => {
        if (!state) { navigate("/flights"); }
    }, [state, navigate]);

    if (!state) return null;

    return (
        <div className="payment-view-container">
            <div className="container">
                <div className="payment-card-master row g-0">

                    {status !== "success" ? (
                        <>
                            {/* LEFT COLUMN: PAYMENT */}
                            <div className="col-lg-7 payment-main-section">
                                <div className="payment-header">
                                    <h2>Secure Payment</h2>
                                    <p>Scan the code below with any UPI app to pay ₹{totalAmount}</p>
                                </div>

                                <div className={`qr-display-wrapper ${status === "verifying" ? "verifying" : ""}`}>
                                    <div className="upi-id-badge">
                                        <i className="fas fa-wallet me-2"></i> rathodshweta281@axl
                                    </div>

                                    <div className="qr-image-container">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=rathodshweta281@axl&pn=TourPlanner&am=${totalAmount}&cu=INR&tn=FlightBooking`)}`}
                                            alt="Payment QR"
                                        />
                                        {status === "pending" && <div className="scan-anim-line"></div>}
                                    </div>

                                    {status === "verifying" ? (
                                        <div className="verification-overlay">
                                            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
                                            <span>Verifying Payment...</span>
                                        </div>
                                    ) : (
                                        <p className="text-muted small mb-4">Detection of payment is automatic after you scan.</p>
                                    )}

                                    <button
                                        className="btn-confirm-payment"
                                        onClick={handleSimulatePayment}
                                        disabled={status === "verifying"}
                                    >
                                        {status === "verifying" ? "Processing..." : "I have Scanned & Paid"}
                                    </button>
                                </div>

                                <div className="trust-badges">
                                    <div className="trust-badge"><i className="fas fa-lock text-success"></i> 256-bit SSL</div>
                                    <div className="trust-badge"><i className="fas fa-check-circle text-primary"></i> Verified Merchant</div>
                                    <div className="trust-badge"><i className="fas fa-shield-alt text-info"></i> Secure Flow</div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: SUMMARY */}
                            <div className="col-lg-5 payment-summary-panel">
                                <h3 className="summary-heading">Booking Summary</h3>

                                <div className="summary-flight-card">
                                    <div className="route-visualization">
                                        <div className="code">BOM</div>
                                        <div className="plane-line">
                                            <i className="fas fa-plane"></i>
                                        </div>
                                        <div className="code">{destination?.name?.substring(0, 3).toUpperCase() || "DEST"}</div>
                                    </div>
                                    <p className="text-center small text-indigo-200 mb-0">{flight?.airline} • {flight?.time}</p>
                                </div>

                                <div className="summary-details">
                                    <div className="detail-row">
                                        <label>Passenger</label>
                                        <span>{passenger?.name}</span>
                                    </div>
                                    <div className="detail-row">
                                        <label>Journey Date</label>
                                        <span>{journeyDate}</span>
                                    </div>
                                    <div className="detail-row">
                                        <label>Seat Preference</label>
                                        <span className="badge bg-primary px-3">{seatType}</span>
                                    </div>
                                    <div className="detail-row">
                                        <label>Travelers</label>
                                        <span>{adults} Adult(s)</span>
                                    </div>

                                    <div className="total-payable-box text-center">
                                        <label className="d-block text-indigo-300 small mb-1">TOTAL AMOUNT</label>
                                        <div className="amount">₹{totalAmount}</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* SUCCESS VIEW - SMALLER COMPACT BOX */
                        <div className="col-lg-10 mx-auto py-4 success-screen-wrapper">
                            <div className="success-card shadow-sm border rounded-4 bg-white">
                                <div className="success-icon-container">
                                    <i className="fas fa-check"></i>
                                </div>
                                <h2 className="fw-bold mb-2">Booking Confirmed!</h2>
                                <p className="text-muted mb-4 small-on-mobile">Your payment was successful and your tickets are ready.</p>

                                <div className="success-info-card">
                                    <div className="detail-row mb-2 border-bottom pb-2">
                                        <label className="small text-muted">Transaction ID</label>
                                        <span className="text-dark font-monospace small-text">{txnId}</span>
                                    </div>
                                    <div className="detail-row mb-2 border-bottom pb-2">
                                        <label className="small text-muted">Booking Date</label>
                                        <span className="text-dark small-text">{new Date().toLocaleDateString()}</span>
                                    </div>
                                    <div className="detail-row">
                                        <label className="small text-muted">Payment Mode</label>
                                        <span className="text-dark small-text">UPI Transfer</span>
                                    </div>
                                </div>

                                <div className="success-actions mt-3">
                                    <button onClick={() => downloadReceipt()} className="btn btn-warning btn-sm px-4 rounded-pill fw-bold text-white shadow-sm">
                                        <i className="fas fa-file-pdf me-2"></i> Download Receipt
                                    </button>
                                    <a
                                        href="https://docs.google.com/forms/d/e/1FAIpQLScumjRuWOFv97nyPT6qdplIBX1z4PNcb7Oylbd9jMnpDyIknA/viewform?usp=sf_link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary btn-sm px-4 rounded-pill fw-bold shadow-sm"
                                    >
                                        <i className="fas fa-star me-2"></i> Share Feedback
                                    </a>
                                    <Link to="/Profile" className="btn btn-dark btn-sm px-4 rounded-pill fw-bold">
                                        View Book
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlightPayment;
