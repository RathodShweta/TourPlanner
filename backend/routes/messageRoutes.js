const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { sendMessageToAdmin, getAdminMessages, replyToUser, getUserMessages } = require("../controllers/messageController");

// POST send message
router.post("/send", protect, sendMessageToAdmin);

// GET user messages
router.get("/user-messages", protect, getUserMessages);

// GET all messages (Admin Only)
router.get("/all", protect, admin, getAdminMessages);

// POST reply (Admin Only)
router.post("/reply", protect, admin, replyToUser);

module.exports = router;
