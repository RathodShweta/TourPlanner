import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "FlightBooking";

const FlightBooking = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setBookings(data.reverse()); // latest first
  }, []);

  return (
    <div className="container py-4">

      {/* ===== HEADER WITH HOME BUTTON ===== */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">✈️ Flight Booking History</h3>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/")}
        >
           Home
        </button>
      </div>

      {bookings.length === 0 ? (
        <p>No flight bookings found</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
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
                <th>Transaction ID</th>
                <th>Date & Time</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b, i) => (
                <tr key={b.id + i}>
                  <td>{i + 1}</td>

                  <td>
                    {b.passenger?.name}
                    <br />
                    <small className="text-muted">
                      {b.passenger?.email}
                    </small>
                  </td>

                  <td>
                    Your City → {b.destination?.name}
                  </td>

                  <td>
                    {b.flight?.airline}
                    <br />
                    <small className="text-muted">
                      {b.flight?.type}
                    </small>
                  </td>

                  <td>{b.journeyDate}</td>

                  <td>{b.adults} Adult(s)</td>

                  <td>₹{b.totalAmount}</td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`badge ${
                        b.status === "success"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </td>

                  <td>{b.id}</td>

                  <td>{b.dateTime}</td>
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
