const mongoose = require("mongoose");

const flightBookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        destinationName: {
            type: String,
            required: true,
        },
        airline: {
            type: String,
            required: true,
        },
        passengerName: {
            type: String,
            required: true,
        },
        passengerEmail: {
            type: String,
            required: true,
        },
        journeyDate: {
            type: String,
            required: true,
        },
        departureTime: {
            type: String,
        },
        seatType: {
            type: String,
        },
        adults: {
            type: Number,
            default: 1,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: ["success", "failed", "pending"],
            default: "success",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("FlightBooking", flightBookingSchema);
