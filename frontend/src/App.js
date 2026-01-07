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
import Payment from "./Components/Paymentdesti";
import Paymntdetaildesti from "./Components/paymntdetaildesti";
import Paymentdesti from "./Components/Paymentdesti"
import DestinationBooking from "./Components/DestinationBooking";
import HotelBooking from "./Components/HotelBooking";
import HotelPayment from "./Components/HotelPayment";
import Hotelpaydestin from "./Components/Hotelpaydestin";
import FlightReview from "./Components/FlightReview";
import FlightPayment from "./Components/FlightPayment";
import FlightBooking from "./Components/FlightBooking"
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
          <Route path="/DestinationBooking" element={<DestinationBooking />}/>
          <Route path="/HotelPayment" element={<HotelPayment />} />
          <Route path="/HotelBooking" element={<HotelBooking />} /> 
          <Route path="/Hotelpaydestin" element={<Hotelpaydestin/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/FlightReview" element={<FlightReview />} />
          <Route path="/FlightPayment" element={<FlightPayment/>} />
          <Route path="/FlightBooking" element={<FlightBooking/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
