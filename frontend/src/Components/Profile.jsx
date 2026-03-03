import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [wishlistHotels, setWishlistHotels] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    /* ================= LOAD WISHLIST ================= */
    const wishlistIds = JSON.parse(localStorage.getItem("wishlist")) || [];
    const allHotels = JSON.parse(localStorage.getItem("hotels")) || [];

    const matchedHotels = allHotels.filter((h) =>
      wishlistIds.includes(h._id)
    );
    setWishlistHotels(matchedHotels);

    /* ================= LOAD BOOKINGS ================= */
    if (token) {
      fetch("http://localhost:5000/api/hotel-bookings/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setBookings(data.data || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  /* ================= UPLOAD PROFILE PHOTO ================= */
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch("http://localhost:5000/api/users/upload-photo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const updatedUser = { ...user, photo: data.user.photo };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        alert(data.message || "Failed to upload photo");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /* ================= REMOVE FROM WISHLIST ================= */
  const removeFromWishlist = (hotelId) => {
    const wishlistIds = JSON.parse(localStorage.getItem("wishlist")) || [];
    const updatedIds = wishlistIds.filter((id) => id !== hotelId);
    localStorage.setItem("wishlist", JSON.stringify(updatedIds));
    setWishlistHotels((prev) =>
      prev.filter((hotel) => hotel._id !== hotelId)
    );
  };

  if (loading) return <p className="center-text">Loading profile...</p>;
  if (!user) return <p className="center-text">Please login</p>;

  return (
    <div className="profile-container">
      {/* 🔹 PROFILE NAVBAR */}
      <div className="profile-nav">
        <button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          👤 Profile
        </button>

        <button
          className={activeTab === "wishlist" ? "active" : ""}
          onClick={() => setActiveTab("wishlist")}
        >
          ❤️ Wishlist
          {wishlistHotels.length > 0 && (
            <span className="wishlist-badge">{wishlistHotels.length}</span>
          )}
        </button>

        <button
          className={activeTab === "bookings" ? "active" : ""}
          onClick={() => setActiveTab("bookings")}
        >
          📘 Bookings
        </button>
      </div>

      {/* 👤 PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="profile-card">
          {/* Profile Photo with Upload Overlay */}
          <div
            className="profile-img-wrapper"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={
                user.photo
                  ? `http://localhost:5000/profile_photos/${user.photo}`
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="profile-img"
            />
            <div className="photo-upload-overlay">
              {uploading ? (
                <span className="upload-spinner">⏳</span>
              ) : (
                <span className="camera-icon">📷</span>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>

          <h2>{user.name}</h2>
          <p>📧 {user.email}</p>
          <p>📞 {user.phone || "Not added"}</p>

          <h4>Total Trips Planned: {bookings.length}</h4>

          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/EditProfile")}
          >
            ✏️ Edit Profile
          </button>
        </div>
      )}

      {/* ❤️ WISHLIST TAB */}
      {activeTab === "wishlist" && (
        <div className="wishlist-fullscreen">
          {wishlistHotels.length === 0 ? (
            <p className="center-text">No hotels in wishlist</p>
          ) : (
            <div className="wishlist-grid-full">
              {wishlistHotels.map((hotel) => (
                <div className="wishlist-card-full" key={hotel._id}>
                  <img src={hotel.images?.[0]} alt={hotel.name} />
                  <div className="wishlist-body">
                    <h4>{hotel.name}</h4>
                    <p className="location">📍 {hotel.location}</p>
                    <p className="price">₹{hotel.pricePerNight} / night</p>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromWishlist(hotel._id)}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 📘 BOOKINGS TAB */}
      {activeTab === "bookings" && (
        <div className="profile-section">
          <h3>📘 My Bookings</h3>

          <div className="booking-actions">
            <button
              className="booking-btn"
              onClick={() => navigate("/FlightBooking")}
            >
              ✈️ Flight Booking
            </button>
            <button
              className="booking-btn"
              onClick={() => navigate("/HotelBooking")}
            >
              🏨 Hotel Booking
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="no-bookings">
              <p>🏨 No bookings found</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/hotels")}
              >
                Browse Hotels
              </button>
            </div>
          ) : (
            <div className="booking-cards">
              {bookings.map((b) => (
                <div className="booking-card" key={b._id}>
                  <div className="booking-card-header">
                    <h5>🏨 {b.hotel?.name || "Hotel"}</h5>
                    <span className={`booking-status status-${b.status}`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="booking-card-body">
                    <div className="booking-detail">
                      <span className="booking-label">📍 Location</span>
                      <span>{b.hotel?.location || "—"}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="booking-label">📅 Travel Date</span>
                      <span>{b.travelDate}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="booking-label">🌙 Nights</span>
                      <span>{b.nights}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="booking-label">🪑 Rooms</span>
                      <span>{b.seats?.join(", ")}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="booking-label">💰 Amount</span>
                      <span className="booking-amount">₹{b.totalAmount}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="booking-label">🧾 Txn ID</span>
                      <span className="booking-txn">{b.transactionId}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
