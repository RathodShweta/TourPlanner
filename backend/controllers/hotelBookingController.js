const HotelBooking = require("../models/HotelBooking");

/**
 * BOOK SEATS (after payment success)
 */
const createHotelBooking = async (req, res) => {
  try {
    const {
      hotelId,
      userId,
      travelDate,
      nights,
      seats,
      totalAmount,
      transactionId,
    } = req.body;

    if (!hotelId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Hotel ID and User ID are required",
      });
    }

    // Check already booked seats for same hotel & date
    const existingBookings = await HotelBooking.find({
      hotel: hotelId,
      travelDate,
      status: "success",
    });

    const alreadyBookedSeats = existingBookings.flatMap((b) => b.seats);

    const conflict = seats.some((seat) => alreadyBookedSeats.includes(seat));

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: "One or more seats already booked",
      });
    }

    const booking = await HotelBooking.create({
      hotel: hotelId,
      user: userId,
      travelDate,
      nights,
      seats,
      totalAmount,
      transactionId,
      status: "success",
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      message: "Booking failed",
    });
  }
};

/**
 * GET BOOKED SEATS (for seat layout page)
 */
const getBookedSeats = async (req, res) => {
  try {
    const { hotelId, travelDate } = req.query;

    const bookings = await HotelBooking.find({
      hotel: hotelId,
      travelDate,
      status: "success",
    });

    const seats = bookings.flatMap((b) => b.seats);

    res.status(200).json({
      success: true,
      seats,
    });
  } catch (error) {
    console.error("Get booked seats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch seats",
    });
  }
};

/**
 * GET ALL HOTEL BOOKINGS (history page)
 */
const getAllHotelBookings = async (req, res) => {
  try {
    const bookings = await HotelBooking.find()
      .populate("hotel", "name location")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Fetch all bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking history",
    });
  }
};

/**
 * GET MY BOOKINGS (for logged-in user)
 */
const getMyBookings = async (req, res) => {
  try {
    const bookings = await HotelBooking.find({ user: req.user.id })
      .populate("hotel", "name location images pricePerNight")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Fetch my bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your bookings",
    });
  }
};


module.exports = {
  createHotelBooking,
  getBookedSeats,
  getAllHotelBookings,
  getMyBookings,
};
