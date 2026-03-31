const express = require("express");
const router = express.Router();
const { getAllFlights, createFlight } = require("../controllers/flightController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/", getAllFlights);
router.post("/", protect, admin, createFlight);

module.exports = router;
