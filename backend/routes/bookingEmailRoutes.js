const express = require("express");
const router = express.Router();
const { sendBookingConfirmation } = require("../controllers/bookingEmailController");

router.post("/send-confirmation", sendBookingConfirmation);

module.exports = router;
