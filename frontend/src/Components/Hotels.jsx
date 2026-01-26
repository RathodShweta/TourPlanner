import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

const Hotels = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [hotels, setHotels] = useState([]);

  // ❤️ WISHLIST STATE
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  // 🌐 DEFAULT ONLINE HOTEL IMAGES (2–3 SLIDE)
  const defaultHotelImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
  ];

  // FETCH HOTELS
  useEffect(() => {
    const cachedHotels = localStorage.getItem("hotels");

    if (cachedHotels) {
      setHotels(JSON.parse(cachedHotels));
    } else {
      fetchHotels();
    }
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/hotels");
      setHotels(res.data.data);
      localStorage.setItem("hotels", JSON.stringify(res.data.data));
    } catch (error) {
      console.error("Failed to load hotels", error);
    }
  };

  // ❤️ CHECK WISHLIST
  const isInWishlist = (hotelId) => wishlist.includes(hotelId);

  // ❤️ TOGGLE WISHLIST
  const toggleWishlist = (hotel) => {
    let updatedWishlist;

    if (wishlist.includes(hotel._id)) {
      updatedWishlist = wishlist.filter((id) => id !== hotel._id);
    } else {
      updatedWishlist = [...wishlist, hotel._id];
    }

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  // 🏨 BOOK HOTEL
  const handleBooking = (hotel) => {
    if (!hotel?.pricePerNight) {
      alert("Hotel price not available");
      return;
    }

    if (!isLoggedIn) {
      alert(t("loginFirst"));
      navigate("/login");
      return;
    }

    navigate("/Hotelpaydestin", {
      state: {
        hotel,
        nights: 1,
        totalAmount: hotel.pricePerNight,
        user: JSON.parse(localStorage.getItem("user")),
      },
    });
  };

  return (
    <div className="container py-5" style={{ paddingBottom: "10%" }}>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">{t("premiumHotels")}</h2>
        <Link to="/" className="btn btn-outline-dark">
          ← {t("home")}
        </Link>
      </div>

      {/* HOTEL CARDS */}
      <div className="row g-4">
        {hotels.map((hotel) => (
          <div className="col-12 col-sm-6 col-lg-4" key={hotel._id}>
            <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">

              {/* IMAGE SLIDER */}
              <div
                id={`carousel-${hotel._id}`}
                className="carousel slide carousel-fade"
                data-bs-ride="carousel"
                data-bs-interval="3000"
              >
                {/* ❤️ HEART ICON */}
                <button
                  onClick={() => toggleWishlist(hotel)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 10,
                    background: "rgba(255,255,255,0.9)",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  {isInWishlist(hotel._id) ? "❤️" : "🤍"}
                </button>

                <div className="carousel-inner">
                  {(hotel.images && hotel.images.length > 0
                    ? hotel.images
                    : defaultHotelImages
                  ).map((img, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${
                        index === 0 ? "active" : ""
                      }`}
                    >
                      <img
                        src={img}
                        alt={hotel.name}
                        className="d-block w-100"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>

                {/* SLIDER CONTROLS */}
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target={`#carousel-${hotel._id}`}
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon"></span>
                </button>

                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target={`#carousel-${hotel._id}`}
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon"></span>
                </button>
              </div>

              {/* CARD BODY */}
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="fw-bold">{hotel.name}</h5>
                  <p className="text-muted small">📍 {hotel.location}</p>
                  <p className="fw-bold text-primary">
                    ₹{hotel.pricePerNight} / night
                  </p>
                </div>

                {/* MAP */}
                <div
                  style={{
                    height: "120px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    marginBottom: "12px",
                  }}
                >
                  <iframe
                    src={hotel.mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    title={hotel._id}
                  ></iframe>
                </div>

                <button
                  className="btn btn-dark w-100 fw-bold"
                  style={{ padding: "12px", borderRadius: "12px" }}
                  onClick={() => handleBooking(hotel)}
                >
                  {t("bookStay")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotels;
