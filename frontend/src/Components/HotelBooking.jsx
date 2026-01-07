import React, { useEffect, useState } from "react";

const STORAGE_KEY = "HotelBooking";

const HotelBooking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setBookings(data.reverse()); // latest first
  }, []);

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-3">🏨 Hotel Booking History</h3>

      {bookings.length === 0 ? (
        <p>No hotel bookings found</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Hotel</th>
                <th>Location</th>
                <th>User</th>
                <th>Travel Date</th>
                <th>Days</th>
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
                  <td>{b.hotel?.name}</td>
                  <td>{b.hotel?.location}</td>
                  <td>{b.user?.name || "Guest"}</td>
                  <td>{b.travelDate}</td>
                  <td>{b.nights}</td>
                  <td>₹{b.totalAmount}</td>

                  {/* STATUS BADGE */}
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

export default HotelBooking;
