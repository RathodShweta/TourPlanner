import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  // Gender Selection States
  const [showGenderSelection, setShowGenderSelection] = useState(false);
  const [loadingGender, setLoadingGender] = useState(false);

  const handleGenderSelect = async (gender) => {
    setLoadingGender(true);
    const defaultPhotos = {
      Male: "male_default.jpg",
      Female: "female_default.jpg"
    };

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/users/set-gender", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ gender, photo: defaultPhotos[gender] })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userUpdate")); // Sync Navbar
        navigate("/");
      } else {
        setError(data.message || "Failed to set gender");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoadingGender(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔗 combine first + last name
    const fullName = `${firstName} ${lastName}`;

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setShowOTP(true);

    } catch (err) {
      setError("Something went wrong");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setVerifyingOtp(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userUpdate"));

        setSuccess(true);
        if (!data.user.gender) {
          setShowGenderSelection(true);
          setShowOTP(false);
        } else {
          setTimeout(() => navigate("/"), 2000);
        }
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setResendMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: 'verification' })
      });
      const data = await res.json();
      if (res.ok) {
        setResendMessage("Registration code resent to " + email);
        setTimeout(() => setResendMessage(""), 5000);
      } else {
        setError(data.message || "Failed to resend code");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setResendLoading(false);
    }
  };

  if (showGenderSelection) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="card p-4 shadow-lg text-center border-0" style={{ maxWidth: "400px", borderRadius: "20px" }}>
          <h3 className="fw-bold mb-4" style={{ color: "#181E4B" }}>One Last Step! ✨</h3>
          <p className="text-secondary mb-4">Please select your gender to personalize your profile experience.</p>

          <div className="d-flex gap-4 justify-content-center mb-4">
            <div
              className="gender-option p-3 rounded-4 border btn-outline-primary"
              style={{ cursor: 'pointer', transition: '0.3s', minWidth: '120px' }}
              onClick={() => !loadingGender && handleGenderSelect("Male")}
            >
              <img src="http://localhost:5000/profile_photos/male_default.jpg" alt="Male" style={{ width: '60px' }} className="mb-2" />
              <div className="fw-bold">Male</div>
            </div>

            <div
              className="gender-option p-3 rounded-4 border btn-outline-danger"
              style={{ cursor: 'pointer', transition: '0.3s', minWidth: '120px' }}
              onClick={() => !loadingGender && handleGenderSelect("Female")}
            >
              <img src="http://localhost:5000/profile_photos/female_default.jpg" alt="Female" style={{ width: '60px' }} className="mb-2" />
              <div className="fw-bold">Female</div>
            </div>
          </div>

          {loadingGender && (
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}

          {error && <p className="text-danger small">{error}</p>}
        </div>
      </div>
    );
  }

  if (showOTP) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="card p-4 shadow-lg text-center border-0" style={{ maxWidth: "400px", borderRadius: "20px" }}>
          <div className="mb-3">
            <i className="fas fa-check-shield fa-3x" style={{ color: "#181E4B" }}></i>
          </div>
          <h3 className="fw-bold mb-2" style={{ color: "#181E4B" }}>Confirm Your Identity</h3>
          <p className="text-secondary mb-4">A 6-digit security code was sent to <b>{email}</b>.</p>

          <form onSubmit={handleVerifyOTP}>
            <div className="mb-4">
              <input
                type="text"
                className="form-control text-center fs-3 fw-bold"
                style={{ letterSpacing: '8px', borderRadius: '12px', border: '2px solid #eee' }}
                maxLength="6"
                placeholder="------"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-100 fw-bold py-3 text-white shadow-sm"
              disabled={verifyingOtp}
              style={{ backgroundColor: "#181E4B", borderRadius: '12px' }}
            >
              {verifyingOtp ? "Verifying..." : "Verify & Register"}
            </button>
          </form>

          <div className="mt-4">
            <p className="text-secondary small mb-1">Didn't receive the code?</p>
            <button
              className="btn btn-link text-decoration-none fw-bold p-0"
              style={{ color: "#DF6951", fontSize: '0.9rem' }}
              onClick={handleResendOTP}
              disabled={resendLoading}
            >
              {resendLoading ? "Sending..." : "Resend New Code"}
            </button>
          </div>

          <button
            className="btn btn-link text-decoration-none mt-3 text-secondary small"
            onClick={() => setShowOTP(false)}
          >
            ← Change Email
          </button>

          {resendMessage && <p className="text-success mt-3 small fw-bold"><i className="fas fa-check-circle me-1"></i> {resendMessage}</p>}
          {error && <p className="text-danger mt-3 small">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center align-items-center position-relative" style={{ minHeight: "80vh" }}>
      <Link
        to="/"
        className="position-absolute top-0 start-0 m-4 text-decoration-none fw-bold"
        style={{ color: "#181E4B", fontSize: "1.1rem" }}
      >
        ← {t("backHome")}
      </Link>

      <div className="card p-4 shadow-sm responsive-card">
        <h2 className="text-center mb-4 fw-bold" style={{ color: "#181E4B" }}>
          {t("join")}
        </h2>

        {error && <p className="text-danger text-center">{error}</p>}
        {success && (
          <div className="alert alert-success text-center animate-fade-in" style={{ borderRadius: '12px' }}>
            <i className="fas fa-check-circle me-2"></i> Account verified successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-secondary">{t("firstName")}</label>
              <input
                type="text"
                className="form-control"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label text-secondary">{t("lastName")}</label>
              <input
                type="text"
                className="form-control"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary">{t("email")}</label>
            <input
              type="email"
              className="form-control"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary">{t("password")}</label>
            <input
              type="password"
              className="form-control"
              placeholder={t("createPassword")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>


          <button
            type="submit"
            className="btn w-100 fw-bold mt-2"
            style={{ backgroundColor: "#181E4B", color: "white" }}
          >
            {t("createAccount")}
          </button>
        </form>

        <p className="text-center mt-3 text-secondary">
          {t("alreadyMember")}{" "}
          <Link to="/login" className="text-decoration-none fw-bold" style={{ color: "#DF6951" }}>
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
