import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  // 🔁 Update user on route change
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <h2 className="logo">TourPlanner</h2>
      </Link>

      {/* CENTER NAV LINKS */}
      <ul className="nav-links">
        <li><Link to="/destinations">{t("navDestinations")}</Link></li>
        <li><Link to="/hotels">{t("navHotels")}</Link></li>
        <li><Link to="/flights">{t("navFlights")}</Link></li>
        <li><Link to="/faq">{t("navFAQ")}</Link></li>

        {/* 🤖 TourBot */}
        <li>
          <Link to="/tourbot" className="tourbot-btn">🤖 TourBot</Link>
        </li>

        {/* 📘 Booking (ONLY AFTER LOGIN) */}
        {user && (
          <li className="dropdown">
            <button
              className="btn dropdown-toggle booking-btn"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              📘 Booking
            </button>

            <ul className="dropdown-menu">
              <li>
                <Link className="dropdown-item" to="/FlightBooking">
                  ✈️ Flight Booking
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/HotelBooking">
                  🏨 Hotel Booking
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/DestinationBooking">
                  📍 Destinations Booking
                </Link>
              </li>
            </ul>
          </li>
        )}
      </ul>

      {/* RIGHT SIDE ACTIONS */}
      <div className="nav-actions">
        {/* LANGUAGE */}
        <select
          onChange={changeLanguage}
          className="lang-select"
          value={i18n.language}
        >
          <option value="en">English</option>
          <option value="mr">Marathi</option>
          <option value="hi">Hindi</option>
        </select>

        {user ? (
          <div className="dropdown">
            <button
              className="btn dropdown-toggle fw-bold"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ color: "#181E4B" }}
            >
              Hi, {user.name.split(" ")[0]}
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link className="dropdown-item" to="/profile">
                  profile
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button
                  className="dropdown-item text-danger fw-bold"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <Link to="/login" className="login">{t("login")}</Link>
            <Link to="/signup" className="signup">{t("signup")}</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
