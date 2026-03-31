const Flight = require("../models/Flight");

exports.getAllFlights = async (req, res) => {
    try {
        const flights = await Flight.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: flights.length, data: flights });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch flights" });
    }
};

exports.createFlight = async (req, res) => {
    try {
        const flight = new Flight(req.body);
        await flight.save();
        res.status(201).json({ success: true, data: flight });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
