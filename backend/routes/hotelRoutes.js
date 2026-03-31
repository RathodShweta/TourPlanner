const express = require("express");
const router = express.Router();
const { getAllHotels, createHotel } = require("../controllers/hotelController");
const { protect, admin } = require("../middleware/authMiddleware");

// GET /api/hotels
router.get("/", getAllHotels);

// POST /api/hotels (Admin Only)
router.post("/", protect, admin, createHotel);

module.exports = router;
