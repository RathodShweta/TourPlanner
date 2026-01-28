import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentDetailDesti = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const place = state?.place;
  if (!place) {
    return <p className="text-center mt-5">No destination selected</p>;
  }

  return (
    <div className="container py-5">

      {/* ================= IMAGE GALLERY (3–5 Images) ================= */}
      <div
        id="destinationCarousel"
        className="carousel slide mb-4 shadow rounded"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {place.images.map((img, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <img
                src={img}
                alt={`${place.name} ${index + 1}`}
                className="d-block w-100"
                style={{ height: "380px", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#destinationCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#destinationCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* ================= DESTINATION HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">{place.name}</h2>
          <p className="text-muted mb-0">📍 {place.state}</p>
        </div>
        <div className="text-end">
          <h5 className="text-warning mb-1">{place.price}</h5>
          <small>⭐ {place.rating} / 5</small>
        </div>
      </div>

      {/* ================= QUICK INFO ================= */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="border rounded p-3 h-100">
            <b>Best Time</b>
            <p className="text-muted mb-0">{place.bestTime}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="border rounded p-3 h-100">
            <b>Season</b>
            <p className="text-muted mb-0">{place.season}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="border rounded p-3 h-100">
            <b>Starting Budget</b>
            <p className="text-muted mb-0">{place.price}</p>
          </div>
        </div>
      </div>

      {/* ================= ABOUT ================= */}
      <div className="mb-4">
        <h4 className="fw-bold">📖 About {place.name}</h4>
        <p className="text-muted">{place.desc}</p>
      </div>

      {/* ================= FAMOUS PLACES ================= */}
      <div className="mb-4">
        <h4 className="fw-bold">📍 Famous Places to Visit</h4>
        <ul className="list-group list-group-flush">
          {place.famousPlaces.map((p, i) => (
            <li key={i} className="list-group-item">✔ {p}</li>
          ))}
        </ul>
      </div>

      {/* ================= LOCAL FOOD ================= */}
      <div className="mb-4">
        <h4 className="fw-bold">🍽️ Local Food</h4>
        <ul className="list-group list-group-flush">
          {place.food.map((f, i) => (
            <li key={i} className="list-group-item">🍴 {f}</li>
          ))}
        </ul>
      </div>

      {/* ================= HOTELS ================= */}
      <div className="mb-4">
        <h4 className="fw-bold">🏨 Hotels Available</h4>
        <ul className="list-group list-group-flush">
          {place.hotels.map((h, i) => (
            <li key={i} className="list-group-item">🏨 {h}</li>
          ))}
        </ul>
      </div>

      {/* ================= TRANSPORT ================= */}
      <div className="mb-5">
        <h4 className="fw-bold">🚕 Transport Options</h4>
        <ul className="list-group list-group-flush">
          {place.transport.map((t, i) => (
            <li key={i} className="list-group-item">🚗 {t}</li>
          ))}
        </ul>
      </div>

      {/* ================= ACTION BAR ================= */}
      <div className="card shadow-sm">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Ready to book your trip to {place.name}?</h5>
          <div>
            <button
              className="btn btn-outline-secondary me-2"
              onClick={() => navigate(-1)}
            >
              ⬅ Back
            </button>
            <button className="btn btn-warning fw-bold">
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PaymentDetailDesti;
