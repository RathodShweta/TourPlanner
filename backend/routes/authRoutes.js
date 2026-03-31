const express = require("express");
const {
  registerUser,
  loginUser,
  verifyOTP,
  forgotPassword,
  resetPassword,
  resendOTP
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOTP);

module.exports = router;
