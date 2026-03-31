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
  const [fullyBookedDates, setFullyBookedDates] = useState([]);

  /* ---------- FETCH FULLY BOOKED DATES ---------- */
  useEffect(() => {
    if (!hotel) return;

    axios
      .get("http://localhost:5000/api/hotel-bookings/fully-booked-dates", {
        params: { hotelId: hotel._id }
      })
      .then((res) => {
        setFullyBookedDates(res.data.dates || []);
      })
      .catch(() => setFullyBookedDates([]));
  }, [hotel]);

  /* ---------- FETCH BOOKED ROOMS FOR SELECTED DATE ---------- */
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
      .catch(() => setBookedSeats([]));
  }, [hotel, travelDate]);

  /* ---------- SAFE RETURN ---------- */
  if (!hotel || !user) {
    return <h3 className="text-center mt-5">No hotel selected</h3>;
  }

  /* ---------- AVAILABILITY ---------- */
  const bookedRooms = bookedSeats.length;
  const availableRooms = TOTAL_ROOMS - bookedRooms;
  const isAvailable = availableRooms > 0;

  /* ---------- PRICE ---------- */
  const pricePerNight = Number(hotel.pricePerNight);
  const estimatedAmount = pricePerNight * days;

  /* ---------- CONFIRM ---------- */
  const handleConfirm = () => {
    if (!travelDate) {
      alert("Please select travel date");
      return;
    }

    if (fullyBookedDates.includes(travelDate)) {
      alert("Rooms are fully booked on selected date");
      return;
    }

    if (!isAvailable) {
      alert("Rooms not available");
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

  /* ---------- DATE CHANGE ---------- */
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    if (fullyBookedDates.includes(selectedDate)) {
      alert("❌ Fully booked date selected");
      setTravelDate("");
      return;
    }

    setTravelDate(selectedDate);
  };

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-4 px-3" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h4 className="fw-bold m-0">🏨 Confirm Booking Details</h4>
        <button className="btn btn-outline-dark btn-sm" onClick={() => navigate("/")}>
          <i className="fas fa-home me-2"></i> Home
        </button>
      </div>

      <div className="card shadow-lg p-4 mx-auto responsive-card" style={{ maxWidth: "900px" }}>
        <div className="row g-4">

          {/* LEFT */}
          <div className="col-md-6">
            <h6 className="fw-bold">👤 User Details</h6>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>

            <hr />

            <h6 className="fw-bold">💺 Room Availability</h6>
            <p><b>Total Rooms:</b> {TOTAL_ROOMS}</p>
            <p className="text-danger"><b>Booked:</b> {bookedRooms}</p>
            <p className={isAvailable ? "text-success" : "text-danger"}>
              <b>Status:</b>{" "}
              {!travelDate ? "Select Date" : isAvailable ? "Available" : "Full"}
            </p>
            <p><b>Available Rooms:</b> {availableRooms}</p>

            <div
              className="border rounded text-center mt-3 p-3"
              style={{
                cursor: travelDate && isAvailable ? "pointer" : "not-allowed",
                opacity: travelDate && isAvailable ? 1 : 0.6
              }}
              onClick={travelDate && isAvailable ? handleConfirm : undefined}
            >
              <h5 className="fw-bold">BOOK</h5>
              <small>
                {!travelDate
                  ? "Select Date"
                  : isAvailable
                    ? "Select Rooms"
                    : "Rooms Full"}
              </small>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-md-6">
            <h6 className="fw-bold">🏨 Hotel Details</h6>
            <p><b>Hotel:</b> {hotel.name}</p>
            <p><b>Location:</b> {hotel.location}</p>
            <p><b>Price / Night:</b> ₹{pricePerNight}</p>

            <label className="fw-bold">Travel Date</label>
            <input
              type="date"
              className="form-control mb-3"
              min={new Date().toISOString().split("T")[0]}
              value={travelDate}
              onChange={handleDateChange}
            />

            <label className="fw-bold">Number of Nights</label>
            <select
              className="form-select mb-3"
              value={days}
              disabled={!isAvailable}
              onChange={(e) => setDays(Number(e.target.value))}
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

            <div className="border rounded p-3 text-center">
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
