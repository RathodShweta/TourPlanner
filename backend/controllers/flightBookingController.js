const FlightBooking = require("../models/FlightBooking");

// Submit a flight booking
exports.createFlightBooking = async (req, res) => {
    try {
        const {
            destinationName,
            airline,
            passengerName,
            passengerEmail,
            journeyDate,
            departureTime,
            seatType,
            adults,
            totalAmount,
            transactionId,
        } = req.body;

        const booking = await FlightBooking.create({
            user: req.user.id,
            destinationName,
            airline,
            passengerName,
            passengerEmail,
            journeyDate,
            departureTime,
            seatType,
            adults,
            totalAmount,
            transactionId,
            status: "success",
        });

        res.status(201).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        console.error("Flight booking error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all flight bookings (Admin)
exports.getAllFlightBookings = async (req, res) => {
    try {
        const bookings = await FlightBooking.find().populate("user", "name email").sort("-createdAt");
        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
