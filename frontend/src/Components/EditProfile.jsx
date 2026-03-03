import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Load user data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
      return;
    }

    setName(storedUser.name || "");
    setEmail(storedUser.email || "");
    setPhone(storedUser.phone || "");
  }, [navigate]);

  // 🔹 Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/users/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email, phone }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Update failed");
        setLoading(false);
        return;
      }

      // ✅ Update localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Profile updated successfully ✅");
      navigate("/Profile");

    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 responsive-card">
      <h2 className="text-center mb-4">✏️ Edit Profile</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      <form onSubmit={handleSubmit}>

        {/* Profile Image */}
        <div className="text-center mb-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="Profile"
            className="edit-profile-img"
          />
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        {/* Buttons */}
        <button
          type="submit"
          className="btn btn-primary w-100 fw-bold"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          className="btn btn-secondary w-100 mt-2"
          onClick={() => navigate("/Profile")}
        >
          Cancel
        </button>

      </form>
    </div>
  );
};

export default EditProfile;
