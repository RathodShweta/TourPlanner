import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentDetailDesti.css";

const PaymentDetailDesti = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const place = state?.place;
  if (!place) {
    return (
      <div className="container py-5 text-center">
        <i className="fas fa-map-marked-alt fa-3x text-muted mb-3"></i>
        <h2 className="text-secondary">No Destination Selected</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/destinations")}>Go to Destinations</button>
      </div>
    );
  }

  return (
    <div className="payment-detail-container page-fade-in">
      {/* ================= HERO SECTION ================= */}
      <div className="destination-detail-hero">
        <div
          id="destinationCarousel"
          className="carousel slide hero-carousel"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner h-100">
            {place.images.map((img, index) => (
              <div
                key={index}
                className={`carousel-item h-100 ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={img}
                  alt={`${place.name}`}
                  className="d-block w-100"
                />
              </div>
            ))}
          </div>
          {place.images.length > 1 && (
            <>
              <button className="carousel-control-prev" type="button" data-bs-target="#destinationCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon"></span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#destinationCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon"></span>
              </button>
            </>
          )}
        </div>
        <div className="hero-overlay">
          <div className="hero-info-content">
            <h2>{place.name}</h2>
            <p><i className="fas fa-map-marker-alt me-2"></i> {place.state}</p>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="detail-layout-grid">
          {/* LEFT CONTENT AREA */}
          <div className="main-detail-content">
            {/* About Section */}
            <div className="info-section-card">
              <h4 className="section-title"><i className="fas fa-book-open"></i> Explore the Essence</h4>
              <p className="desc-paragraph">{place.desc}</p>
            </div>

            {/* Famous Places Section */}
            <div className="info-section-card">
              <h4 className="section-title"><i className="fas fa-camera-retro"></i> Must Visit Spots</h4>
              <div className="highlights-grid">
                {place.famousPlaces?.map((p, i) => (
                  <div key={i} className="highlight-item">
                    <i className="fas fa-check-circle"></i> {p}
                  </div>
                ))}
              </div>
            </div>

            {/* Iconic Food Section */}
            <div className="info-section-card">
              <h4 className="section-title"><i className="fas fa-utensils"></i> Iconic Flavours</h4>
              <div className="highlights-grid">
                {place.food?.map((f, i) => (
                  <div key={i} className="highlight-item">
                    <i className="fas fa-star" style={{ color: '#f59e0b' }}></i> {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Transport Section */}
            <div className="info-section-card">
              <h4 className="section-title"><i className="fas fa-route"></i> Seamless Connectivity</h4>
              <div className="highlights-grid">
                {place.transport?.map((t, i) => (
                  <div key={i} className="highlight-item">
                    <i className="fas fa-shuttle-van" style={{ color: '#3b82f6' }}></i> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Hotels Section */}
            <div className="info-section-card">
              <h4 className="section-title"><i className="fas fa-hotel"></i> Premium Stays</h4>
              <div className="highlights-grid">
                {place.hotels?.map((h, i) => (
                  <div key={i} className="highlight-item">
                    <i className="fas fa-concierge-bell" style={{ color: '#8b5cf6' }}></i> {h}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR - BOOKING BOX */}
          <div className="sidebar-booking-area">
            <div className="booking-sidebar-card">
              <div className="price-box">
                <small>Starting From</small>
                <h3>{place.price}</h3>
                <div className="rating-display">
                  <i className="fas fa-star me-2"></i> {place.rating} / 5.0
                </div>
              </div>

              <div className="sidebar-stats">
                <div className="stat-row">
                  <span className="stat-label">Duration</span>
                  <span className="stat-value">{place.duration}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Best Season</span>
                  <span className="stat-value">{place.bestSeason}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Category</span>
                  <span className="stat-value">{place.budgetType} Budget</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Status</span>
                  <span className="stat-value text-success">Available</span>
                </div>
              </div>

              {/* <button className="btn-proceed-pay" onClick={() => navigate("/payment")}>
                Confirm Selection & Proceed
              </button> */}

              <button className="btn-back-link" onClick={() => navigate(-1)}>
                <i className="fas fa-chevron-left me-2"></i> Choose Another Destination
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailDesti;
