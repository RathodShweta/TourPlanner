import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css";

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: "none" }}>
        <h2 className="logo">TourPlanner</h2>
      </Link>

      <ul className="nav-links">
        <li>
          <Link to="/destinations">{t("navDestinations")}</Link>
        </li>
        <li>
          <Link to="/hotels">{t("navHotels")}</Link>
        </li>
        <li>
          <Link to="/flights">{t("navFlights")}</Link>
        </li>
        <li>
          <Link to="/faq">{t("navFAQ")}</Link>
        </li>

        <Link to="/tourbot" className="tourbot-btn">🤖 TourBot</Link>
      </ul>

      <div className="nav-actions">
        <Link to="/login" className="login">
          {t("login")}
        </Link>
        <Link to="/signup" className="signup">
          {t("signup")}
        </Link>

        {/* 🌍 Language Dropdown */}
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
