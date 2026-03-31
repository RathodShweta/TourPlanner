const express = require("express");
const router = express.Router();
const { getAllDestinations, createDestination } = require("../controllers/destinationController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/", getAllDestinations);
router.post("/", protect, admin, createDestination);

module.exports = router;
