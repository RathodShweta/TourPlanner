const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { updateProfile, getProfile } = require("../controllers/userController");

// GET /api/users/profile
router.get("/profile", authMiddleware, getProfile);

// PUT /api/users/update-profile
router.put("/update-profile", authMiddleware, updateProfile);

module.exports = router;
