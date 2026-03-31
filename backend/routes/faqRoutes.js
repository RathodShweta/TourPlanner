const express = require("express");
const router = express.Router();
const { getAllFAQs, createFAQ } = require("../controllers/faqController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/", getAllFAQs);
router.post("/", protect, admin, createFAQ);

module.exports = router;
