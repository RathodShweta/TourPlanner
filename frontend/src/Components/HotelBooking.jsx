import React, { useEffect, useState } from "react";
import axios from "axios";

/* ===== Lucide SVG Icons ===== */

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
    <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
  </svg>
);

/* ===== Main Component ===== */

const HotelBooking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/hotel-bookings")
      .then((res) => setBookings(res.data.data))
      .catch(console.error);
  }, []);

  /* ===== Download Receipt PDF ===== */
  const downloadReceiptPDF = (b) => {
    const gst = (b.totalAmount * 0.18).toFixed(2);
    const grandTotal = (Number(b.totalAmount) + Number(gst)).toFixed(2);

    const win = window.open("", "_blank");

    win.document.write(`
      <html>
      <head>
        <title>Booking Receipt</title>
        <style>
          body { font-family: Arial; padding: 5vw; }
          .receipt {
            max-width: 98vw;
            width: 100%;
            margin: auto;
            border: 1px solid #ccc;
            padding: 4vw 3vw;
            box-sizing: border-box;
            border-radius: 12px;
          }
          h2 { text-align: center; }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 6px 0;
          }
          .total {
            border-top: 1px dashed #000;
            margin-top: 10px;
            padding-top: 10px;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 15px;
            font-size: 12px;
          }
          @media (max-width: 576px) {
            .receipt {
              padding: 3vw 2vw;
              border-radius: 8px;
            }
          }
        </style>
      </head>

      <body>
        <div class="receipt">
          <h2>🏨 Hotel Booking Receipt</h2>

          <div class="row"><span>Customer</span><span>${b.user?.name || "Guest User"}</span></div>
          <div class="row"><span>Hotel</span><span>${b.hotel?.name}</span></div>
          <div class="row"><span>Travel Date</span><span>${b.travelDate}</span></div>
          <div class="row"><span>Seats</span><span>${b.seats.join(", ")}</span></div>
          <div class="row"><span>Status</span><span>${b.status}</span></div>

          <div class="row"><span>Base Amount</span><span>₹${b.totalAmount}</span></div>
          <div class="row"><span>GST (18%)</span><span>₹${gst}</span></div>

          <div class="row total">
            <span>Grand Total</span>
            <span>₹${grandTotal}</span>
          </div>

          <div class="footer">
            Thank you for booking with us 💙 <br/>
            This is a system generated receipt.
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

  /* ===== Share Receipt ===== */
  const shareReceipt = (b) => {
    const gst = (b.totalAmount * 0.18).toFixed(2);
    const grandTotal = (Number(b.totalAmount) + Number(gst)).toFixed(2);

    if (navigator.share) {
      navigator.share({
        title: "Hotel Booking Receipt",
        text: `
Customer: ${b.user?.name || "Guest"}
Hotel: ${b.hotel?.name}
Date: ${b.travelDate}
Amount: ₹${b.totalAmount}
GST (18%): ₹${gst}
Grand Total: ₹${grandTotal}
Status: ${b.status}
        `,
      });
    } else {
      alert("Sharing not supported in this browser");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-3">🏨 Booking History</h3>

      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>Customer</th>
            <th>Hotel</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Receipt</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.user?.name || "Guest"}</td>
              <td>{b.hotel?.name}</td>
              <td>{b.travelDate}</td>
              <td>₹{b.totalAmount}</td>
              <td>{b.status}</td>

              <td className="d-flex justify-content-center gap-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => downloadReceiptPDF(b)}
                  title="Download Receipt"
                >
                  <DownloadIcon />
                </button>

                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={() => shareReceipt(b)}
                  title="Share Receipt"
                >
                  <ShareIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HotelBooking;
