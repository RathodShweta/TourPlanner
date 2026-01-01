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
import Payment from "./Components/Payment";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* ✅ NAVBAR ONLY ONCE */}
        <Navbar />

        {/* ✅ ROUTES */}
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/tourbot" element={<TourBot />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* PAYMENT */}
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
