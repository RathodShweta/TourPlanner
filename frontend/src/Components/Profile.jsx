import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [wishlistHotels, setWishlistHotels] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

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

    // ✅ Match wishlist IDs with hotel objects
    const matchedHotels = allHotels.filter((h) =>
      wishlistIds.includes(h._id)
    );

    setWishlistHotels(matchedHotels);

    /* ================= LOAD BOOKINGS ================= */

    fetch("http://localhost:5000/api/bookings/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setBookings(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

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
    <>
      {/* ================= NAV ================= */}
      <div className="profile-container">
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
              <span className="wishlist-badge">
                {wishlistHotels.length}
              </span>
            )}
          </button>

          <button
            className={activeTab === "bookings" ? "active" : ""}
            onClick={() => setActiveTab("bookings")}
          >
            📘 Bookings
          </button>
        </div>
      </div>

      {/* ================= PROFILE TAB ================= */}
      {activeTab === "profile" && (
        <div className="profile-container">
          <div className="profile-card">
            <img
              src={
                user.photo
                  ? `http://localhost:5000/uploads/${user.photo}`
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
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
        </div>
      )}

      {/* ================= WISHLIST TAB ================= */}
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
                    <p className="price">
                      ₹{hotel.pricePerNight} / night
                    </p>

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

      {/* ================= BOOKINGS TAB ================= */}
      {activeTab === "bookings" && (
        <div className="profile-container profile-section">
          <h3>📘 My Bookings</h3>

          {/* ===== Booking Actions ===== */}
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

          {/* ===== Booking History ===== */}
          {bookings.length === 0 ? (
            <p className="center-text mt-3">No bookings found</p>
          ) : (
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.type}</td>
                    <td>{b.name}</td>
                    <td
                      className={
                        b.status === "Confirmed"
                          ? "status-confirmed"
                          : "status-cancelled"
                      }
                    >
                      {b.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

    </>
  );
};

export default Profile;
