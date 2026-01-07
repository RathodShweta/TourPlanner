import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
        totalAmount
    } = state;

    const [status, setStatus] = useState("pending"); // pending | success | failed
    const [txnId, setTxnId] = useState("");

    /* 🔒 BACKEND SIMULATION (ADMIN DECIDES) */
    const backendCheck = async () => {
        try {
            const response = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({
                        approved: false, // 🔁 change to true for SUCCESS
                        transactionId: "FLIGHT-TXN-" + Date.now()
                    });

                    // ❌ simulate backend down
                    // reject("No response");
                }, 1000);
            });

            return response;
        } catch {
            return null;
        }
    };

    const startPayment = () => {
        setStatus("pending");
        setTxnId("");

        // ⏳ SHOW QR FOR 5–6 SECONDS
        setTimeout(async () => {
            const response = await backendCheck();

            const finalStatus =
                response && response.approved === true
                    ? "success"
                    : "failed";

            const transactionId =
                response?.transactionId || "FLIGHT-TXN-" + Date.now();

            setTxnId(transactionId);
            setStatus(finalStatus);

            /* ✅ SAVE BOTH SUCCESS & FAILED */
            const booking = {
                id: transactionId,
                destination,
                flight,
                passenger,
                journeyDate,
                adults,
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
        }, 5500);
    };

    useEffect(() => {
        startPayment();
    }, []);

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <h3 style={titleStyle}>🧾 Flight Payment</h3>

                {/* PASSENGER */}
                <Section title="👤 Passenger Details">
                    <Row label="Name" value={passenger.name} />
                    <Row label="Email" value={passenger.email} />
                </Section>

                {/* FLIGHT */}
                <Section title="✈️ Flight Details">
                    <Row label="From" value="Your City" />
                    <Row label="To" value={destination.name} />
                    <Row label="Airline" value={flight.airline} />
                    <Row label="Type" value={flight.type} />
                    <Row label="Departure" value={flight.time} />
                    <Row label="Date" value={journeyDate} />
                    <Row label="Passengers" value={`${adults} Adult(s)`} />
                </Section>

                {/* AMOUNT */}
                <div style={amountBox}>
                    <strong>Total Amount: ₹{totalAmount}</strong>
                </div>

                {/* ⏳ PENDING */}
                {status === "pending" && (
                    <div style={centerBox}>
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=UPI"
                            alt="QR"
                            style={{
                                width: "70px",
                                height: "70px",
                                marginBottom: "6px"
                            }}
                        />

                        <p style={mutedText}>
                            Waiting for payment confirmation...
                        </p>
                        <div className="spinner-border spinner-border-sm text-primary"></div>
                    </div>
                )}

                {/* ❌ FAILED */}
                {status === "failed" && (
                    <div style={centerBox}>
                        <div style={failedBox}>❌ Payment Failed</div>
                        <button style={retryBtn} onClick={startPayment}>
                            Retry Payment
                        </button>
                    </div>
                )}

                {/* ✅ SUCCESS */}
                {status === "success" && (
                    <div style={centerBox}>
                        <div style={successBox}>
                            ✅ Payment Successful
                            <div style={{ fontSize: "12px" }}>
                                Txn ID: {txnId}
                            </div>
                        </div>
                    </div>
                )}

                {/* ALWAYS VISIBLE */}
                <button
                    style={historyBtn}
                    onClick={() => navigate("/FlightBooking")}
                >
                    View Flight Booking History
                </button>
            </div>
        </div>
    );
};

/* ---------- SMALL COMPONENTS ---------- */

const Section = ({ title, children }) => (
    <div style={sectionBox}>
        <div style={sectionTitle}>{title}</div>
        {children}
    </div>
);

const Row = ({ label, value }) => (
    <div style={rowStyle}>
        <span>{label}</span>
        <strong>{value}</strong>
    </div>
);

/* ---------- STYLES ---------- */

const pageStyle = {
    minHeight: "calc(100vh - 70px)",
    background: "#f4f6f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    paddingTop: "70px" // push content below fixed navbar
};

const cardStyle = {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)"
};

const titleStyle = {
    textAlign: "center",
    marginBottom: "16px"
};

const sectionBox = {
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "12px"
};

const sectionTitle = {
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "6px"
};

const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    marginBottom: "4px"
};

const amountBox = {
    background: "#eef3ff",
    padding: "10px",
    borderRadius: "10px",
    textAlign: "center",
    marginBottom: "12px"
};

const centerBox = {
    textAlign: "center",
    marginBottom: "12px"
};

const mutedText = {
    fontSize: "12px",
    color: "#666",
    marginTop: "6px"
};

const successBox = {
    background: "#d1e7dd",
    padding: "10px",
    borderRadius: "8px",
    color: "#0f5132",
    fontWeight: "600"
};

const failedBox = {
    background: "#f8d7da",
    padding: "10px",
    borderRadius: "8px",
    color: "#842029",
    fontWeight: "600",
    marginBottom: "8px"
};

const retryBtn = {
    width: "100%",
    padding: "10px",
    background: "#ffc107",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer"
};

const historyBtn = {
    width: "100%",
    padding: "10px",
    background: "#212529",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
};

export default FlightPayment;
