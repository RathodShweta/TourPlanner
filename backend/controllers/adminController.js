const HotelBooking = require("../models/HotelBooking");
const FlightBooking = require("../models/FlightBooking");
const Feedback = require("../models/Feedback");

exports.getAdminDashboardStats = async (req, res) => {
    try {
        const hotelBookingsCount = await HotelBooking.countDocuments();
        const flightBookingsCount = await FlightBooking.countDocuments();
        const feedbackCount = await Feedback.countDocuments();

        // Get details for tables
        const hotelBookings = await HotelBooking.find()
            .populate("hotel", "name location")
            .populate("user", "name email")
            .sort("-createdAt");

        // Flight highlights
        const flightBookings = await FlightBooking.find()
            .populate("user", "name email")
            .sort("-createdAt");

        // Feedback highlights
        const feedbacks = await Feedback.find()
            .populate("user", "name email")
            .sort("-createdAt");

        // Charts data (Bookings over time - last 7 days)
        const statsData = [
            { name: 'Hotel Bookings', value: hotelBookingsCount, color: '#4f46e5' },
            { name: 'Flight Bookings', value: flightBookingsCount, color: '#10b981' },
            { name: 'Feedbacks', value: feedbackCount, color: '#f59e0b' }
        ];

        res.json({
            success: true,
            counts: {
                hotels: hotelBookingsCount,
                flights: flightBookingsCount,
                feedbacks: feedbackCount
            },
            details: {
                hotelBookings,
                flightBookings,
                feedbacks
            },
            chartData: statsData
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
