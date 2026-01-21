import React, { useEffect, useState } from "react";
import axios from "axios";

const HotelBooking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/hotel-bookings")
      .then((res) => setBookings(res.data.data))
      .catch(console.error);
  }, []);

  return (
    <div className="container py-4">
      <h3 className="fw-bold">🏨 Booking History</h3>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Hotel</th>
            <th>Date</th>
            <th>Seats</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.hotel?.name}</td>
              <td>{b.travelDate}</td>
              <td>{b.seats.join(", ")}</td>
              <td>₹{b.totalAmount}</td>
              <td>{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HotelBooking;
