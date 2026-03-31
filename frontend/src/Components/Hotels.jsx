import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "./Hotels.css";
import Loader from "./Loader";

// Import Hotel Images
import hotel1 from "../assets/hotels/hotel1.jpg";
import hotel2 from "../assets/hotels/hotel2.jpg";
import hotel3 from "../assets/hotels/hotel3.jpg";

const Hotels = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("wishlist")) || []);
  const defaultHotelImages = [hotel1, hotel2, hotel3];

  useEffect(() => {
    const cachedHotels = localStorage.getItem("hotels");
    if (cachedHotels) {
      setHotels(JSON.parse(cachedHotels));
      setLoading(false);
    } else {
      fetchHotels();
    }
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/hotels");
      setHotels(res.data.data || []);
      localStorage.setItem("hotels", JSON.stringify(res.data.data));
    } catch (error) {
      console.error("Failed to load hotels", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (hotel) => {
    let updated;
    if (wishlist.includes(hotel._id)) {
      updated = wishlist.filter((id) => id !== hotel._id);
    } else {
      updated = [...wishlist, hotel._id];
    }
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const handleBooking = (hotel) => {
    if (!hotel?.pricePerNight) return alert("Price not available");
    if (!isLoggedIn) {
      alert(t("loginFirst"));
      navigate("/login");
      return;
    }
    navigate("/Hotelpaydestin", {
      state: { hotel, nights: 1, totalAmount: hotel.pricePerNight, user: JSON.parse(localStorage.getItem("user")) }
    });
  };

  return (
    <div className="hotels-page page-fade-in">
      {loading && <Loader />}
      <header className="hotels-header">
        <div className="header-overlay">
          <div className="container d-flex justify-content-between align-items-center h-100">
            <div className="text-white text-start">
              <h1 className="text-white">{t("findPerfectStay")} <span style={{ color: '#ffc107' }}>Stay</span></h1>
              <p className="mb-0">{t("hotelsDesc")}</p>
            </div>
            <button className="btn btn-warning shadow fw-bold px-4 py-2" onClick={() => navigate("/")}>
              <i className="fas fa-home me-2"></i> {t("home")}
            </button>
          </div>
        </div>
      </header>

      <div className="container py-5">
        <div className="section-title-area d-flex justify-content-between align-items-center mb-5">
          <h2 className="fw-bold mb-0">{t("premiumCollections")}</h2>
          {JSON.parse(localStorage.getItem("user"))?.isAdmin && (
            <button className="btn btn-primary btn-sm rounded-pill px-3 py-1 shadow-sm border-0 fw-bold" style={{ fontSize: '0.75rem' }} onClick={() => navigate("/admin/add-hotel")}>
              <i className="fas fa-plus me-1" style={{ fontSize: '0.7rem' }}></i> {t("addHotel") || "Add Hotel"}
            </button>
          )}
          <div className="sort-filters">
            <span className="badge-filter active">{t("allStays")}</span>
            <span className="badge-filter">{t("luxury")}</span>
            <span className="badge-filter">{t("budget")}</span>
            <span className="badge-filter">{t("resorts")}</span>
          </div>
        </div>

        <div className="hotels-grid">
          {hotels.map((hotel) => (
            <div className="hotel-premium-card" key={hotel._id}>
              <div className="hotel-img-wrapper">
                <img src={hotel.images?.[0] || defaultHotelImages[0]} alt={hotel.name} />
                {(hotel.rating >= 4.7 || !hotel.rating) && (
                  <div className="hotel-badge-top"><i className="fas fa-crown"></i> {t("recommended")}</div>
                )}
                <button className={`wishlist-heart ${wishlist.includes(hotel._id) ? 'active' : ''}`} onClick={() => toggleWishlist(hotel)}>
                  <i className={wishlist.includes(hotel._id) ? "fas fa-heart" : "far fa-heart"}></i>
                </button>
                <div className="price-overlay">₹{hotel.pricePerNight}<span>/{t("night")}</span></div>
              </div>

              <div className="hotel-info">
                <div className="rating-row">
                  <span className="location-tag"><i className="fas fa-map-marker-alt"></i> {hotel.location}</span>
                  <span className="stars"><i className="fas fa-star text-warning"></i> {hotel.rating || (4.5 + Math.random() * 0.5).toFixed(1)}</span>
                </div>
                <h3>{hotel.name}</h3>

                <div className="hotel-features">
                  {hotel.pricePerNight > 2000 ? (
                    <>
                      <span><i className="fas fa-wifi"></i> WiFi</span>
                      <span><i className="fas fa-swimming-pool"></i> Pool</span>
                      <span><i className="fas fa-utensils"></i> Breakfast</span>
                    </>
                  ) : (
                    <>
                      <span><i className="fas fa-wifi"></i> WiFi</span>
                      <span><i className="fas fa-fan"></i> AC</span>
                      <span><i className="fas fa-parking"></i> Parking</span>
                    </>
                  )}
                </div>

                <div className="map-preview">
                  <iframe src={hotel.mapSrc} title={hotel.name} loading="lazy"></iframe>
                </div>

                <button className="btn-book-hotel" onClick={() => handleBooking(hotel)}>
                  {t("bookYourStay")} <i className="fas fa-long-arrow-alt-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hotels;
