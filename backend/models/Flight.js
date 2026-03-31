const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
    airline: { type: String, required: true },
    time: { type: String, required: true }, // e.g. "09:00 AM"
    duration: { type: String, required: true }, // e.g. "2h 10m"
    type: { type: String, required: true }, // e.g. "Non-stop"
    rating: { type: Number, default: 4.5 },
    price: { type: Number, required: true },
    destination: { type: String, required: true } // Destination Name
}, { timestamps: true });

module.exports = mongoose.model("Flight", flightSchema);
