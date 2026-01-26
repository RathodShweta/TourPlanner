const express = require("express");
const router = express.Router();

const { getAllHotels } = require("../controllers/hotelController");

// GET /api/hotels
router.get("/", getAllHotels);

module.exports = router;
