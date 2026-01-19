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

    fetch("http://localhost:5000/api/bookings/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBookings(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
            <p>No bookings found</p>
          ) : (
            <table>
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

    </div>
  );
};

export default Profile;
