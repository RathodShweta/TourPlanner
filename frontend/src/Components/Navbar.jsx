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
  const [scrolled, setScrolled] = useState(false);

  // 🔁 Update user on route change or custom event
  useEffect(() => {
    const updateUserData = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    updateUserData();

    // Listen for custom profile updates
    window.addEventListener("userUpdate", updateUserData);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("userUpdate", updateUserData);
    };
  }, [location]);

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };


  // 📝 Shared Language Selector Component
  const LanguageSelector = () => (
    <select onChange={changeLanguage} className="lang-select" value={i18n.language}>
      <option value="en">English</option>
      <option value="mr">Marathi</option>
      <option value="hi">Hindi</option>
    </select>
  );

  // 👤 Shared User Actions Component
  const UserActions = ({ isMobile }) => {
    if (!user) {
      return (
        <>
          <Link to="/login" className="login" onClick={() => isMobile && setMenuOpen(false)}>
            {t("login")}
          </Link>
          <Link to="/signup" className="signup" onClick={() => isMobile && setMenuOpen(false)}>
            {t("signup")}
          </Link>
        </>
      );
    }

    return (
      <div className="d-flex align-items-center gap-3">
        <Link
          to="/Profile"
          className="d-flex align-items-center gap-2 text-decoration-none"
          style={{ color: "#181E4B", fontSize: "0.95rem" }}
          onClick={() => isMobile && setMenuOpen(false)}
        >
          {user.photo || user.gender ? (
            <img
              src={
                user.photo
                  ? (user.photo.startsWith("http") ? user.photo : `http://localhost:5000/profile_photos/${user.photo}`)
                  : (user.gender === "Male" ? "http://localhost:5000/profile_photos/male_default.jpg" : (user.gender === "Female" ? "http://localhost:5000/profile_photos/female_default.jpg" : ""))
              }
              alt="Profile"
              className="navbar-avatar"
            />
          ) : (
            <i className="fas fa-user-circle fs-5"></i>
          )}
          <span className="fw-bold">{user.name.split(" ")[0]}</span>
        </Link>
      </div>
    );
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      {/* LOGO */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <h2 className="logo">TourPlanner</h2>
      </Link>

      {/* Hamburger Icon */}
      <button
        className="navbar-toggle"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="navbar-toggle-bar"></span>
        <span className="navbar-toggle-bar"></span>
        <span className="navbar-toggle-bar"></span>
      </button>

      {/* CENTER NAV LINKS */}
      <ul className={`nav-links${menuOpen ? " open" : ""}`}>
        <li>
          <div className="nav-item-admin">
            <Link to="/destinations" onClick={() => setMenuOpen(false)}><i className="fas fa-globe-asia me-1"></i> {t("navDestinations")}</Link>
            {/* {user?.isAdmin && (
              <button className="navbar-add-btn" onClick={() => navigate("/admin/add-destination")} title="Add Destination">+</button>
            )} */}
          </div>
        </li>
        <li>
          <div className="nav-item-admin">
            <Link to="/hotels" onClick={() => setMenuOpen(false)}><i className="fas fa-hotel me-1"></i> {t("navHotels")}</Link>
            {/* {user?.isAdmin && (
              <button className="navbar-add-btn" onClick={() => navigate("/admin/add-hotel")} title="Add Hotel">+</button>
            )} */}
          </div>
        </li>
        <li>
          <div className="nav-item-admin">
            <Link to="/flights" onClick={() => setMenuOpen(false)}><i className="fas fa-plane me-1"></i> {t("navFlights")}</Link>
            {/* {user?.isAdmin && (
              <button className="navbar-add-btn" onClick={() => navigate("/admin/add-flight")} title="Add Flight">+</button>
            )} */}
          </div>
        </li>
        <li>
          <div className="nav-item-admin">
            <Link to="/faq" onClick={() => setMenuOpen(false)}><i className="fas fa-question-circle me-1"></i> {t("navFAQ")}</Link>
            {/* {user?.isAdmin && (
              <button className="navbar-add-btn" onClick={() => navigate("/admin/add-faq")} title="Add FAQ">+</button>
            )} */}
          </div>
        </li>
        {user?.isAdmin && (
          <li>
            <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ color: "#f43f5e", fontWeight: "700" }}>
              <i className="fas fa-user-shield me-1"></i> {t("adminPanel")}
            </Link>
          </li>
        )}

        {/* 🤖 TourBot */}
        <li>
          <Link to="/tourbot" className="tourbot-btn" onClick={() => setMenuOpen(false)}>🤖 {t("TourBot")}</Link>
        </li>

        {/* Mobile Nav Actions */}
        <li className="nav-actions-mobile">
          <LanguageSelector />
          <UserActions isMobile={true} />
        </li>
      </ul>

      {/* Desktop Nav Actions */}
      <div className="nav-actions">
        <LanguageSelector />
        <UserActions isMobile={false} />
      </div>
    </nav>
  );
};
export default Navbar;