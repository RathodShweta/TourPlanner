const express = require("express");
const router = express.Router();

const {
  createHotelBooking,
  getBookedSeats,
  getAllHotelBookings,
} = require("../controllers/hotelBookingController");

router.post("/", createHotelBooking);
router.get("/seats", getBookedSeats);
router.get("/", getAllHotelBookings);

module.exports = router;
