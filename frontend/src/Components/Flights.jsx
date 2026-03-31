import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css";

const Flights = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searching, setSearching] = useState(false);

  // All Destinations
  const destinations = [
    { name: t("udaipurTitle"), value: "Udaipur", type: "Nature", icon: "🌅", price: "₹5,300" },
    { name: t("manaliTitle"), value: "Manali", type: "Hill Station", icon: "⛰️", price: "₹1,200" },
    { name: t("shimlaTitle"), value: "Shimla", type: "Hill Station", icon: "❄️", price: "₹3,800" },
    { name: t("darjeelingTitle"), value: "Darjeeling", type: "Hill Station", icon: "🍃", price: "₹5,100" },
    { name: t("goaTitle"), value: "Goa", type: "Beach", icon: "🏖️", price: "₹6,200" },
    { name: t("andamanTitle"), value: "Andaman", type: "Island", icon: "🏝️", price: "₹8,500" },
    { name: t("varanasiTitle"), value: "Varanasi", type: "Spiritual", icon: "🛕", price: "₹3,200" },
    { name: t("goldenTempleTitle"), value: "Golden Temple", type: "Spiritual", icon: "✨", price: "₹3,500" },
    { name: t("tajMahalTitle"), value: "Taj Mahal", type: "Heritage", icon: "🕌", price: "₹2,800" },
    { name: t("hampiTitle"), value: "Hampi", type: "Heritage", icon: "🏛️", price: "₹4,900" },
    { name: t("jimCorbettTitle"), value: "Jim Corbett", type: "Wildlife", icon: "🐅", price: "₹5,500" },
    { name: t("alleppeyTitle"), value: "Alleppey", type: "Nature", icon: "🛶", price: "₹6,000" },
  ];

  const [activeDest, setActiveDest] = useState(destinations[0]);
  const [flightResults, setFlightResults] = useState([]);

  // Fetch Flights from API
  const fetchFlights = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/flights?destination=${activeDest.value}`);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setFlightResults(data.data);
      } else {
        // Fallback to mock data if no DB results
        setFlightResults([
          { _id: 1, airline: "IndiGo", time: "09:00 AM", duration: "2h 10m", type: "Non-stop", rating: 4.8 },
          { _id: 2, airline: "Air India", time: "12:45 PM", duration: "2h 30m", type: "1 Stop", rating: 4.2 },
          { _id: 3, airline: "Vistara", time: "04:20 PM", duration: "2h 05m", type: "Non-stop", rating: 4.9 },
          { _id: 4, airline: "SpiceJet", time: "08:55 PM", duration: "2h 15m", type: "Non-stop", rating: 4.0 },
        ]);
      }
    } catch (err) {
      console.error("Flight fetch error:", err);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [activeDest]);

  // Handle dropdown change with search simulation
  const handleDestinationChange = (e) => {
    const selected = destinations.find(d => d.value === e.target.value);
    setSearching(true);
    setActiveDest(selected);

    // Simulate API fetch delay
    setTimeout(() => {
      setSearching(false);
    }, 600);
  };

  // helper to check flight status
  const getFlightStatus = (timeStr, durationStr) => {
    const now = new Date();
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const departureDate = new Date();
    departureDate.setHours(hours, minutes, 0, 0);

    const hMatch = durationStr.match(/(\d+)h/);
    const mMatch = durationStr.match(/(\d+)m/);
    const dHours = hMatch ? parseInt(hMatch[1]) : 0;
    const dMins = mMatch ? parseInt(mMatch[1]) : 0;

    const arrivalDate = new Date(departureDate.getTime() + (dHours * 60 + dMins) * 60000);

    return {
      isDeparted: now > departureDate,
      isArrived: now > arrivalDate
    };
  };

  return (
    <div className="flights-page-container">
      {/* HEADER with Professional Dropdown */}
      <div className="flights-header-section">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h2 className="fw-bold mb-0">{t("flightBookings")}</h2>
            <div className="d-flex gap-2">
              {JSON.parse(localStorage.getItem("user"))?.isAdmin && (
                <button
                  className="btn btn-primary btn-sm rounded-pill px-3 py-1 shadow-sm border-0 fw-bold"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => navigate("/admin/add-flight")}
                >
                  <i className="fas fa-plus me-1" style={{ fontSize: '0.7rem' }}></i> {t("addFlight")}
                </button>
              )}
              <div className="destination-selector-wrapper-compact">
                <select
                  className="destination-select-compact"
                  value={activeDest.value}
                  onChange={handleDestinationChange}
                >
                  {destinations.map((d, i) => (
                    <option key={i} value={d.value}>{d.icon} {d.name}</option>
                  ))}
                </select>
              </div>
              <Link to="/" className="btn btn-outline-dark btn-sm">← {t("home")}</Link>
            </div>
          </div>


          {/* Detailed Destination Info Card */}
          <div className="selected-dest-card mt-2">
            <div className="d-flex align-items-center gap-3">
              <span className="dest-icon-large-compact">{activeDest.icon}</span>
              <div className="flex-grow-1">
                <h5 className="mb-0 fw-bold">{t("tripTo")} {activeDest.name}</h5>
                <p className="mb-0 text-muted tiny-header">{activeDest.type} • {t("bestPriceGuaranteed") || "Best Price Guaranteed"}</p>
              </div>
              <div className="text-end">
                <div className="h5 mb-0 fw-bold text-success">{activeDest.price}</div>
                <small className="text-muted tiny-header">{t("startingFrom")}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLIGHT LIST: Automatically updates on selection */}
      <div className="flight-main-content container">
        <div className="flight-results-header mb-4">
          <h3 className="fw-bold">{t("availableFlightsTo")} {activeDest.name}</h3>
          <p className="text-muted mb-0">{t("realTimeFlightOptions") || "Real-time flight options for your selected destination"}</p>
        </div>

        {searching ? (
          <div className="flights-searching-state">
            <div className="loader-dots">
              <span></span><span></span><span></span>
            </div>
            <p>{t("searchingBestFlights")} {activeDest.name}...</p>
          </div>
        ) : (
          <div className="flight-results-grid">
            {flightResults.map((flight) => {
              const { isDeparted, isArrived } = getFlightStatus(flight.time, flight.duration);

              return (
                <div key={flight._id} className={`flight-strip ${isDeparted ? 'departed-flight' : ''}`}>
                  <div className="airline-brand">
                    <div className="airline-logo-box">✈️</div>
                    <div>
                      <div className="fw-bold">{flight.airline}</div>
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-muted">{flight.type}</small>
                        <span className="badge bg-light text-dark border sm-rating">
                          <i className="fas fa-star text-warning"></i> {flight.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flight-timing">
                    <div className="h5 mb-0">{flight.time}</div>
                    <small className="text-muted">{t("departure") || "Departure"}</small>
                  </div>
                  <div className="flight-duration">
                    <div className={`duration-line ${isArrived ? 'arrived' : 'available'}`}></div>
                    <div className={`flight-status ${isDeparted ? 'status-departed' : 'status-available'}`}>
                      {isArrived ? (t("arrived") || 'Arrived') : isDeparted ? (t("alreadyDeparted") || 'Already Departed') : (t("available") || 'Available')}
                    </div>
                    <small className="text-muted">{flight.duration}</small>
                  </div>
                  <div className="flight-price">
                    <div className="h5 mb-0 fw-bold text-success">{activeDest.price}</div>
                    <small className="text-muted tiny-header">{t("perPerson")}</small>
                  </div>

                  {!isDeparted && (
                    <button
                      className="btn btn-warning btn-sm fw-bold text-white px-3"
                      onClick={() =>
                        navigate("/FlightReview", {
                          state: {
                            destination: activeDest,
                            flight
                          }
                        })
                      }
                    >
                      {t("book") || "Book"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Flights;
