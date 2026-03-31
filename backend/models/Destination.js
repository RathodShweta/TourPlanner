const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    state: { type: String, required: true },
    season: { type: String, required: true }, // Summer, Winter, Monsoon
    bestSeason: { type: String, required: true }, // e.g. "Oct to Mar"
    duration: { type: String, required: true }, // e.g. "4-5 Days"
    budgetType: { type: String, required: true }, // Low, Medium, High
    rating: { type: Number, default: 4.5 },
    price: { type: String, required: true }, // e.g. "₹18,000"
    category: { type: String, required: true }, // Beach, Adventure, etc.
    desc: { type: String, required: true },
    images: [{ type: String }],
    famousPlaces: [{ type: String }],
    food: [{ type: String }],
    hotels: [{ type: String }],
    transport: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model("Destination", destinationSchema);
