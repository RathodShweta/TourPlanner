import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

      {/* Hamburger Icon */}
      <button className="navbar-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen((open) => !open)}>
        <span className="navbar-toggle-bar"></span>
        <span className="navbar-toggle-bar"></span>
        <span className="navbar-toggle-bar"></span>
      </button>

      {/* CENTER NAV LINKS */}
      <ul className={`nav-links${menuOpen ? " open" : ""}`}>
        <li><Link to="/destinations" onClick={() => setMenuOpen(false)}>{t("navDestinations")}</Link></li>
        <li><Link to="/hotels" onClick={() => setMenuOpen(false)}>{t("navHotels")}</Link></li>
        <li><Link to="/flights" onClick={() => setMenuOpen(false)}>{t("navFlights")}</Link></li>
        <li><Link to="/faq" onClick={() => setMenuOpen(false)}>{t("navFAQ")}</Link></li>

        {/* 🤖 TourBot */}
        <li>
          <Link to="/tourbot" className="tourbot-btn" onClick={() => setMenuOpen(false)}>🤖 TourBot</Link>
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
                <Link className="dropdown-item" to="/FlightBooking" onClick={() => setMenuOpen(false)}>
                  ✈️ Flight Booking
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/HotelBooking" onClick={() => setMenuOpen(false)}>
                  🏨 Hotel Booking
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/DestinationBooking" onClick={() => setMenuOpen(false)}>
                  📍 Destinations Booking
                </Link>
              </li>
            </ul>
          </li>
        )}
        
        {/* Mobile-only nav actions */}
        <li className="nav-actions-mobile">
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
                  <Link className="dropdown-item" to="/Profile" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button
                    className="dropdown-item text-danger fw-bold"
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                  >
                    🚪 Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/login" className="login" onClick={() => setMenuOpen(false)}>{t("login")}</Link>
              <Link to="/signup" className="signup" onClick={() => setMenuOpen(false)}>{t("signup")}</Link>
            </>
          )}
        </li>
      </ul>

      {/* RIGHT SIDE ACTIONS (desktop only) */}
      <div className="nav-actions">
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
                <Link className="dropdown-item" to="/Profile">
                  Profile
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