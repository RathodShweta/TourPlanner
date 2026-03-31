const Hotel = require("../models/Hotel");

// GET all hotels
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    console.error("Get hotels error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hotels",
    });
  }
};

// CREATE a new hotel (Admin Only)
exports.createHotel = async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();

    res.status(201).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    console.error("Create hotel error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create hotel",
    });
  }
};
