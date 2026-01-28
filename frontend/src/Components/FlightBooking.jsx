import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "FlightBooking";

/* ===== ICONS ===== */
const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
    <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
  </svg>
);

const FlightBooking = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setBookings(data.reverse());
  }, []);

  /* ===== DOWNLOAD RECEIPT ===== */
  const downloadReceipt = (b) => {
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
      <head>
        <title>Flight Booking Receipt</title>
        <style>
          body { font-family: Arial; padding: 30px; }
          .box {
            max-width: 600px;
            margin: auto;
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 10px;
          }
          h2 { text-align: center; }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 6px 0;
          }
          .footer {
            text-align: center;
            margin-top: 15px;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h2>✈️ Flight Booking Receipt</h2>

          <div class="row"><span>Passenger</span><span>${b.passenger?.name}</span></div>
          <div class="row"><span>Email</span><span>${b.passenger?.email}</span></div>
          <div class="row"><span>Route</span><span>Your City → ${b.destination?.name}</span></div>
          <div class="row"><span>Airline</span><span>${b.flight?.airline}</span></div>
          <div class="row"><span>Journey Date</span><span>${b.journeyDate}</span></div>
          <div class="row"><span>Passengers</span><span>${b.adults}</span></div>
          <div class="row"><span>Amount</span><span>₹${b.totalAmount}</span></div>
          <div class="row"><span>Status</span><span>${b.status}</span></div>

          <div class="footer">
            Thank you for booking with us 💙<br/>
            Transaction ID: ${b.id}
          </div>
        </div>

        <script>
          window.print();
          window.onafterprint = () => window.close();
        </script>
      </body>
      </html>
    `);

    win.document.close();
  };

  /* ===== SHARE RECEIPT ===== */
  const shareBooking = (b) => {
    if (navigator.share) {
      navigator.share({
        title: "Flight Booking Details",
        text: `
Passenger: ${b.passenger?.name}
Route: Your City → ${b.destination?.name}
Airline: ${b.flight?.airline}
Journey Date: ${b.journeyDate}
Amount: ₹${b.totalAmount}
Status: ${b.status.toUpperCase()}
Transaction ID: ${b.id}
        `,
      });
    } else {
      alert("Sharing not supported in this browser");
    }
  };

  return (
    <div className="container py-4">

      {/* ===== HEADER ===== */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">✈️ Flight Booking History</h3>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
          🏠 Home
        </button>
      </div>

      {bookings.length === 0 ? (
        <p>No flight bookings found</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Passenger</th>
                <th>Route</th>
                <th>Airline</th>
                <th>Journey Date</th>
                <th>Passengers</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Txn ID</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b, i) => (
                <tr key={b.id + i}>
                  <td>{i + 1}</td>

                  <td>
                    {b.passenger?.name}
                    <br />
                    <small className="text-muted">{b.passenger?.email}</small>
                  </td>

                  <td>Your City → {b.destination?.name}</td>

                  <td>
                    {b.flight?.airline}
                    <br />
                    <small className="text-muted">{b.flight?.type}</small>
                  </td>

                  <td>{b.journeyDate}</td>
                  <td>{b.adults}</td>
                  <td>₹{b.totalAmount}</td>

                  <td>
                    <span
                      className={`badge ${
                        b.status === "success" ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </td>

                  <td>{b.id}</td>

                  {/* ACTIONS */}
                  <td className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      title="Download Receipt"
                      onClick={() => downloadReceipt(b)}
                    >
                      <DownloadIcon />
                    </button>

                    <button
                      className="btn btn-sm btn-outline-success"
                      title="Share Booking"
                      onClick={() => shareBooking(b)}
                    >
                      <ShareIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FlightBooking;
