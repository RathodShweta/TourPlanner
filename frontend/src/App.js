import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import ScrollToTop from "./Components/ScrollToTop";
import Home from "./Components/Home";
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
import AdminDashboard from "./Components/AdminDashboard";
import AddHotel from "./Components/AddHotel";
import AddFlight from "./Components/AddFlight";
import AddFAQ from "./Components/AddFAQ";
import AddDestination from "./Components/AddDestination";
import Chat from "./Components/Chat";
import UserProfile from "./Components/UserProfile";
import ProtectedRoute from "./Components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* ✅ Scroll to top on route change */}
        <ScrollToTop />
        {/* ✅ NAVBAR ONLY ONCE */}
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
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

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            {/* 🛠️ ADMIN RESOURCE ADDING ROUTES */}
            <Route
              path="/admin/add-hotel"
              element={
                <ProtectedRoute>
                  <AddHotel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-flight"
              element={
                <ProtectedRoute>
                  <AddFlight />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-faq"
              element={
                <ProtectedRoute>
                  <AddFAQ />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-destination"
              element={
                <ProtectedRoute>
                  <AddDestination />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/:id"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;