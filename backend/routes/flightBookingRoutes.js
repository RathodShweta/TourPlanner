const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { createFlightBooking, getAllFlightBookings } = require("../controllers/flightBookingController");

router.post("/", protect, createFlightBooking);
router.get("/all", protect, admin, getAllFlightBookings);

module.exports = router;
