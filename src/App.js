import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Login from "./Components/Login";   // Make sure you created this file
import Signup from "./Components/Signup"; // Make sure you created this file
import Destinations from "./Components/Destinations";
import Hotels from "./Components/Hotels";
import Flights from "./Components/Flights";
import FAQ from "./Components/FAQ";
import TourBot from "./Components/TourBot";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Main Home Page */}
          <Route path="/" element={<Hero />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/tourbot" element={<TourBot />} />
          {/* Bootstrap Login Page */}
          <Route path="/login" element={<Login />} />
          
          {/* Bootstrap Signup Page */}
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;