const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// Connect MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve profile photos as static files
app.use("/profile_photos", express.static(path.join(__dirname, "profile_photos")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/hotels", require("./routes/hotelRoutes"));
app.use("/api/hotel-bookings", require("./routes/hotelBookingRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tourbot", require("./routes/tourbotRoutes"));

app.get("/", (req, res) => {
  res.send("Backend running with MVC structure 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
