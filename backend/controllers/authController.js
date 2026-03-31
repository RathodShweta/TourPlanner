const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

/* ================= REGISTER ================= */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, gender, photo } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      if (userExists.isVerified) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        // User exists but is unverified. Update their details and resend OTP.
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        userExists.name = name;
        userExists.password = hashedPassword;
        userExists.gender = gender || userExists.gender;
        userExists.photo = photo || userExists.photo;
        userExists.otp = otp;
        userExists.otpExpires = otpExpires;
        await userExists.save();

        // Send Email
        try {
          await sendEmail({
            email,
            subject: "TourPlanner - Verify your account",
            message: `<h1>Welcome to TourPlanner!</h1><p>Your OTP for registration is: <b>${otp}</b></p><p>It is valid for 10 minutes.</p>`
          });

          return res.status(200).json({
            message: "OTP sent to your email. Please verify.",
            email: userExists.email
          });
        } catch (err) {
          console.error("Email error:", err);
          return res.status(500).json({ message: "Error sending OTP email" });
        }
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      gender,
      photo,
      otp,
      otpExpires,
      isVerified: false
    });

    // Send Email
    try {
      await sendEmail({
        email,
        subject: "TourPlanner - Verify your account",
        message: `<h1>Welcome to TourPlanner!</h1><p>Your OTP for registration is: <b>${otp}</b></p><p>It is valid for 10 minutes.</p>`
      });

      res.status(201).json({
        message: "OTP sent to your email. Please verify.",
        email: user.email
      });
    } catch (err) {
      console.error("Email error:", err);
      res.status(500).json({ message: "Error sending OTP email" });
    }

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* ================= LOGIN ================= */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a new 6-digit OTP for EVERY login for proper security verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    // Send Email
    try {
      await sendEmail({
        email,
        subject: "TourPlanner - Login Verification Code",
        message: `<h1>Security Verification</h1><p>Your verification code for login is: <b>${otp}</b></p><p>It is valid for 10 minutes.</p>`
      });
      
      return res.status(403).json({
        message: "Security verification code sent to your email",
        requiresOTP: true,
        email: user.email
      });
    } catch (err) {
      console.error("Email error:", err);
      return res.status(500).json({ message: "Error sending verification code" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        gender: user.gender,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* ================= VERIFY OTP ================= */
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp.trim() || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    // Clear OTP
    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Verification successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        gender: user.gender,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* ================= FORGOT PASSWORD ================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send Email
    try {
      await sendEmail({
        email,
        subject: "TourPlanner - Password Reset OTP",
        message: `<h1>Password Reset</h1><p>Your OTP for password reset is: <b>${otp}</b></p><p>It is valid for 10 minutes.</p>`
      });

      res.json({ message: "Reset OTP sent to your email" });
    } catch (err) {
      console.error("Email error:", err);
      res.status(500).json({ message: "Error sending reset OTP" });
    }

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* ================= RESET PASSWORD ================= */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Password reset successful. Please login." });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* ================= RESEND OTP ================= */
exports.resendOTP = async (req, res) => {
  try {
    const { email, type } = req.body; // type: 'verification' or 'forgot'

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const subject = type === 'forgot' ? "TourPlanner - Password Reset OTP" : "TourPlanner - Verification Code";
    const title = type === 'forgot' ? "Password Reset" : "Security Verification";

    try {
      await sendEmail({
        email,
        subject: subject,
        message: `<h1>${title}</h1><p>Your code is: <b>${otp}</b></p><p>It is valid for 10 minutes.</p>`
      });

      res.json({ message: "New code sent to your email" });
    } catch (err) {
      console.error("Email error:", err);
      res.status(500).json({ message: "Error sending code" });
    }

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
