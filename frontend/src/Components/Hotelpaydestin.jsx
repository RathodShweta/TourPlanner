import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const TOTAL_ROOMS = 24;

const Hotelpaydestin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hotel = location.state?.hotel;
  const user = location.state?.user;

  const [travelDate, setTravelDate] = useState("");
  const [days, setDays] = useState(1);
  const [bookedSeats, setBookedSeats] = useState([]);

  /* ---------------- FETCH BOOKED SEATS (HOOKS ALWAYS RUN) ---------------- */
  useEffect(() => {
    if (!hotel || !travelDate) return;

    axios
      .get("http://localhost:5000/api/hotel-bookings/seats", {
        params: {
          hotelId: hotel._id,
          travelDate
        }
      })
      .then((res) => {
        setBookedSeats(res.data.seats || []);
      })
      .catch((err) => {
        console.error("Failed to fetch booked seats", err);
        setBookedSeats([]);
      });
  }, [hotel, travelDate]);

  /* ---------------- SAFE EARLY RETURN AFTER HOOKS ---------------- */
  if (!hotel || !user) {
    return (
      <h3 className="text-center mt-5">
        No hotel selected
      </h3>
    );
  }

  /* ---------------- ROOM AVAILABILITY LOGIC ---------------- */
  const bookedRooms = bookedSeats.length;
  const availableRooms = TOTAL_ROOMS - bookedRooms;
  const isAvailable = availableRooms > 0;

  /* ---------------- PRICE LOGIC ---------------- */
  const pricePerNight = Number(hotel.pricePerNight);
  const estimatedAmount = pricePerNight * days;

  /* ---------------- BOOK HANDLER ---------------- */
  const handleConfirm = () => {
    if (!travelDate) {
      alert("Please select travel date");
      return;
    }

    if (!isAvailable) {
      alert("Rooms are not available for selected date");
      return;
    }

    if (days > availableRooms) {
      alert(`Only ${availableRooms} rooms available`);
      return;
    }

    navigate("/HotelSeatLayout", {
      state: {
        hotel,
        user,
        travelDate,
        nights: days,
        pricePerNight
      }
    });
  };

  return (
    <div className="container py-3">
      <h4 className="fw-bold text-center mb-4">
        🏨 Confirm Booking Details
      </h4>

      <div
        className="card shadow-lg p-4 mx-auto"
        style={{ maxWidth: "900px", borderRadius: "16px" }}
      >
        <div className="row g-4">

          {/* LEFT SIDE */}
          <div className="col-md-6">
            <h6 className="fw-bold">👤 User Details</h6>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>

            <hr />

            <h6 className="fw-bold">💺 Room Availability</h6>

            <p><b>Total Rooms:</b> {TOTAL_ROOMS}</p>

            <p className="text-danger">
              <b>Booked:</b> {bookedRooms}
            </p>

            <p className={isAvailable ? "text-success" : "text-danger"}>
              <b>Status:</b>{" "}
              {!travelDate
                ? "Select Date"
                : isAvailable
                ? "Available"
                : "Not Available"}
            </p>

            <p>
              <b>Available Rooms:</b> {availableRooms}
            </p>

            <div
              className="border rounded d-flex align-items-center justify-content-center mt-3"
              style={{
                height: "100px",
                cursor:
                  travelDate && isAvailable
                    ? "pointer"
                    : "not-allowed",
                background:
                  travelDate && isAvailable
                    ? "#f8f9fa"
                    : "#e9ecef",
                opacity:
                  travelDate && isAvailable
                    ? 1
                    : 0.6
              }}
              onClick={
                travelDate && isAvailable
                  ? handleConfirm
                  : undefined
              }
            >
              <div className="text-center">
                <h5 className="fw-bold mb-1">BOOK</h5>
                <small className="text-muted">
                  {!travelDate
                    ? "Select Date"
                    : isAvailable
                    ? "Select Rooms"
                    : "Rooms Full"}
                </small>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-md-6">
            <h6 className="fw-bold">🏨 Hotel Details</h6>
            <p><b>Hotel:</b> {hotel.name}</p>
            <p><b>Location:</b> {hotel.location}</p>
            <p><b>Price / Night:</b> ₹{pricePerNight}</p>

            <label className="fw-bold">Travel Date</label>
            <input
              type="date"
              className="form-control mb-3"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
            />

            <label className="fw-bold">Number of Nights</label>
            <select
              className="form-select mb-3"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              disabled={!isAvailable}
            >
              {Array.from(
                { length: Math.min(7, availableRooms) },
                (_, i) => i + 1
              ).map((d) => (
                <option key={d} value={d}>
                  {d} Night{d > 1 && "s"}
                </option>
              ))}
            </select>

            <div className="border rounded p-3 text-center mb-3">
              <h5 className="fw-bold text-primary">
                Estimated Amount: ₹{estimatedAmount}
              </h5>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hotelpaydestin;
