import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  // 🔁 runs on every route change
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]); // 👈 KEY FIX

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
      <Link to="/" style={{ textDecoration: "none" }}>
        <h2 className="logo">TourPlanner</h2>
      </Link>

      <ul className="nav-links">
        <li><Link to="/destinations">{t("navDestinations")}</Link></li>
        <li><Link to="/hotels">{t("navHotels")}</Link></li>
        <li><Link to="/flights">{t("navFlights")}</Link></li>
        <li><Link to="/faq">{t("navFAQ")}</Link></li>
        <Link to="/tourbot" className="tourbot-btn">🤖 TourBot</Link>
      </ul>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="fw-bold" style={{ color: "#181E4B" }}>
              Hi, {user.name.split(" ")[0]}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-link text-danger fw-bold text-decoration-none"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login">{t("login")}</Link>
            <Link to="/signup" className="signup">{t("signup")}</Link>
          </>
        )}

        <select
          onChange={changeLanguage}
          className="lang-select"
          value={i18n.language}
        >
          <option value="en">English</option>
          <option value="mr">Marathi</option>
          <option value="hi">Hindi</option>
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
