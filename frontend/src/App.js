import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Destinations from "./Components/Destinations";
import Hotels from "./Components/Hotels";
import Flights from "./Components/Flights";
import FAQ from "./Components/FAQ";
import TourBot from "./Components/TourBot";
import Login from "./Components/Login";
import Signup from "./Components/Signup";

import Paymntdetaildesti from "./Components/paymntdetaildesti";
import Paymentdesti from "./Components/Paymentdesti";

import DestinationBooking from "./Components/DestinationBooking";
import HotelBooking from "./Components/HotelBooking";
import HotelPayment from "./Components/HotelPayment";
import Hotelpaydestin from "./Components/Hotelpaydestin";

import FlightReview from "./Components/FlightReview";
import FlightPayment from "./Components/FlightPayment";
import FlightBooking from "./Components/FlightBooking";

import HotelSeatLayout from "./Components/HotelSeatLayout";

import Profile from "./Components/Profile";
import EditProfile from "./Components/EditProfile";
import ProtectedRoute from "./Components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* ✅ NAVBAR ONLY ONCE */}
        <Navbar />

        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/tourbot" element={<TourBot />} />

          <Route path="/Paymntdetaildesti" element={<Paymntdetaildesti />} />
          <Route path="/Paymentdesti" element={<Paymentdesti />} />

          <Route path="/DestinationBooking" element={<DestinationBooking />} />
          <Route path="/HotelBooking" element={<HotelBooking />} />
          <Route path="/HotelPayment" element={<HotelPayment />} />
          <Route path="/Hotelpaydestin" element={<Hotelpaydestin />} />

          <Route path="/FlightReview" element={<FlightReview />} />
          <Route path="/FlightPayment" element={<FlightPayment />} />
          <Route path="/FlightBooking" element={<FlightBooking />} />

          <Route path="/HotelSeatLayout" element={<HotelSeatLayout />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🔐 PROTECTED ROUTES */}
          <Route
            path="/Profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/EditProfile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
