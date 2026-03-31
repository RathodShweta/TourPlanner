const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  createHotelBooking,
  getBookedSeats,
  getAllHotelBookings,
  getMyBookings,
} = require("../controllers/hotelBookingController");

router.post("/", createHotelBooking);
router.get("/seats", getBookedSeats);
router.get("/my", protect, getMyBookings);
router.get("/", getAllHotelBookings);

module.exports = router;

