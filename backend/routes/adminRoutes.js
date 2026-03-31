const express = require("express");
const router = express.Router();
const { getAdminDashboardStats } = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/stats", protect, admin, getAdminDashboardStats);

module.exports = router;
