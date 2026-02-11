import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 active tab
  const [activeTab, setActiveTab] = useState("profile");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

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

  if (!user) {
    return <p className="text-center mt-5">Please login to view profile</p>;
  }

  if (loading) {
    return <p className="text-center mt-5">Loading profile...</p>;
  }

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
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="Profile"
            className="profile-img"
          />

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
        <div className="profile-section">
          <h3>❤️ Saved Destinations</h3>

          {user.savedDestinations && user.savedDestinations.length > 0 ? (
            <ul>
              {user.savedDestinations.map((dest, index) => (
                <li key={index}>{dest}</li>
              ))}
            </ul>
          ) : (
            <p>No saved destinations</p>
          )}
        </div>
      )}

      {/* 📘 BOOKINGS TAB */}
      {activeTab === "bookings" && (
        <div className="profile-section">
          <h3>📘 Booking History</h3>

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
