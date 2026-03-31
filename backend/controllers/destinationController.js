const Destination = require("../models/Destination");

exports.getAllDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: destinations.length, data: destinations });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch destinations" });
    }
};

exports.createDestination = async (req, res) => {
    try {
        const destination = new Destination(req.body);
        await destination.save();
        res.status(201).json({ success: true, data: destination });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
