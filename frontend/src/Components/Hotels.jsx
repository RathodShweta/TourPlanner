import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

const Hotels = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [hotels, setHotels] = useState([]);

  // Fetch hotels with caching
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
        user: JSON.parse(localStorage.getItem("user"))
      }
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

              {/* IMAGE CAROUSEL */}
              <div
                id={`carousel-${hotel._id}`}
                className="carousel slide carousel-fade"
                data-bs-ride="carousel"
                data-bs-interval="3000"
              >
                <div className="carousel-inner">
                  {hotel.images.map((img, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
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
              </div>

              {/* CARD BODY */}
              <div className="card-body d-flex flex-column justify-content-between">

                <div>
                  <h5 className="fw-bold">{hotel.name}</h5>
                  <p className="text-muted small mb-1">
                    📍 {hotel.location}
                  </p>
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
                    marginBottom: "12px"
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
