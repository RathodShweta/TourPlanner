import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SEATS = [
    "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8",
    "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8",
    "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8"
];

const getSeatKey = (hotel, date) =>
    `HOTEL_SEATS_${hotel?.name}_${date}`;

const HotelSeatLayout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // ✅ HOOKS FIRST (always)
    const [selectedSeats, setSelectedSeats] = useState([]);

    // ✅ SAFE destructuring
    const hotel = state?.hotel;
    const user = state?.user;
    const travelDate = state?.travelDate;
    const nights = state?.nights;
    const pricePerNight = state?.pricePerNight;

    // ✅ AFTER hooks → validation
    if (!hotel || !user || !travelDate) {
        return (
            <h3 className="text-center mt-5">
                Invalid access
            </h3>
        );
    }

    const seatKey = getSeatKey(hotel, travelDate);

    const bookedSeats =
        JSON.parse(localStorage.getItem(seatKey)) || [];

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

            <p className="text-muted mb-3">
                Red = Booked | Green = Selected
            </p>

            <div className="d-flex flex-wrap gap-3 justify-content-center">
                {SEATS.map((seat) => {
                    const isBooked = bookedSeats.includes(seat);
                    const isSelected = selectedSeats.includes(seat);

                    return (
                        <div
                            key={seat}
                            className={`seat-box ${isBooked
                                    ? "booked"
                                    : isSelected
                                        ? "selected"
                                        : ""
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

            <p className="mt-3">
                Selected Seats:{" "}
                <b>{selectedSeats.join(", ") || "None"}</b>
            </p>

            <h5 className="text-primary mb-3">
                Total Amount: ₹{totalAmount}
            </h5>

            <div className="d-flex justify-content-center gap-3">
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>

                <button
                    className="btn btn-success px-5"
                    disabled={selectedSeats.length === 0}
                    onClick={() =>
                        navigate("/Hotelpayment", {
                            state: {
                                hotel,
                                user,
                                travelDate,
                                nights,
                                seatKey,
                                selectedSeats,
                                totalAmount   // ✅ FINAL amount
                            }
                        })
                    }
                >
                    Confirm & Pay
                </button>
            </div>
        </div>
    );
};

export default HotelSeatLayout;
