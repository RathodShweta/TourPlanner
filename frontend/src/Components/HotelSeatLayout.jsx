import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SEATS = [
  "A1","A2","A3","A4","A5","A6","A7","A8",
  "B1","B2","B3","B4","B5","B6","B7","B8",
  "C1","C2","C3","C4","C5","C6","C7","C8"
];

const HotelSeatLayout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  const hotel = state?.hotel;
  const user = state?.user;
  const travelDate = state?.travelDate;
  const nights = state?.nights;
  const pricePerNight = state?.pricePerNight;

  useEffect(() => {
    if (!hotel || !travelDate) return;

    axios
      .get("http://localhost:5000/api/hotel-bookings/seats", {
        params: {
          hotelId: hotel._id,
          travelDate
        }
      })
      .then((res) => setBookedSeats(res.data.seats))
      .catch(console.error);
  }, [hotel, travelDate]);

  if (!hotel || !user || !travelDate) {
    return <h3 className="text-center mt-5">Invalid access</h3>;
  }

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const totalAmount =
    selectedSeats.length * pricePerNight * nights;

  return (
    <div className="container py-4 text-center">
      <h4 className="fw-bold mb-2">🪑 Select Rooms</h4>

      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {SEATS.map((seat) => {
          const isBooked = bookedSeats.includes(seat);
          const isSelected = selectedSeats.includes(seat);

          return (
            <div
              key={seat}
              className={`seat-box ${
                isBooked ? "booked" : isSelected ? "selected" : ""
              }`}
              onClick={() => toggleSeat(seat)}
              style={{
                cursor: isBooked ? "not-allowed" : "pointer"
              }}
            >
              {seat}
            </div>
          );
        })}
      </div>

      <h5 className="text-primary mt-3">
        Total Amount: ₹{totalAmount}
      </h5>

      <button
        className="btn btn-success mt-3 px-5"
        disabled={selectedSeats.length === 0}
        onClick={() =>
          navigate("/Hotelpayment", {
            state: {
              hotel,
              user,
              travelDate,
              nights,
              selectedSeats,
              totalAmount
            }
          })
        }
      >
        Confirm & Pay
      </button>
    </div>
  );
};

export default HotelSeatLayout;
