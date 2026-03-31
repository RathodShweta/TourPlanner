import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showGenderSelection, setShowGenderSelection] = useState(false);
  const [loadingGender, setLoadingGender] = useState(false);

  // Forgot Password States
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP + New Password
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Login Verification States
  const [showVerificationOTP, setShowVerificationOTP] = useState(false);
  const [verificationOtp, setVerificationOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

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


  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setForgotStep(2);
      } else {
        setError(data.message || "Email not found");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return setError("New password is required");
    setResetLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setResetSuccess(true);
        setForgotStep(1);
        setOtp("");
        setNewPassword("");
        setTimeout(() => {
          setResetSuccess(false);
          setShowForgot(false);
        }, 3000);
      } else {
        setError(data.message || "Verification failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setResetLoading(false);
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
        body: JSON.stringify({ email, otp: verificationOtp })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userUpdate")); // Sync Navbar

        setVerifySuccess(true);
        if (!data.user.gender) {
          setShowGenderSelection(true);
          setShowVerificationOTP(false);
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

  const handleResendOTP = async (type = 'verification') => {
    setResendLoading(true);
    setResendMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type })
      });
      const data = await res.json();
      if (res.ok) {
        setResendMessage("New code sent to " + email);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 403 && data.requiresOTP) {
          setShowVerificationOTP(true);
          return;
        }
        setError(data.message || "Login failed");
        return;
      }

      // ✅ Direct Login
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("userUpdate")); // Sync Navbar

      if (!data.user.gender) {
        setShowGenderSelection(true);
      } else {
        navigate("/");
      }

    } catch (err) {
      setError("Server error");
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

  if (showVerificationOTP) {
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
                value={verificationOtp}
                onChange={(e) => setVerificationOtp(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-100 fw-bold py-3 text-white shadow-sm"
              disabled={verifyingOtp}
              style={{ backgroundColor: "#181E4B", borderRadius: '12px' }}
            >
            {verifyingOtp ? "Verifying..." : "Verify & Login"}
          </button>
          </form>

          <div className="mt-4">
            <p className="text-secondary small mb-1">Didn't receive the code?</p>
            <button
              className="btn btn-link text-decoration-none fw-bold p-0"
              style={{ color: "#DF6951", fontSize: '0.9rem' }}
              onClick={() => handleResendOTP('verification')}
              disabled={resendLoading}
            >
              {resendLoading ? "Sending..." : "Resend New Code"}
            </button>
          </div>

          <button
            className="btn btn-link text-decoration-none mt-3 text-secondary small"
            onClick={() => setShowVerificationOTP(false)}
          >
            ← Back to Login
          </button>

          {resendMessage && <p className="text-success mt-3 small fw-bold"><i className="fas fa-check-circle me-1"></i> {resendMessage}</p>}
          {error && <p className="text-danger mt-3 small">{error}</p>}
          {verifySuccess && (
            <div className="alert alert-success mt-3 small">
              Verified successfully! Redirecting...
            </div>
          )}
        </div>
      </div>
    );
  }


  if (showForgot) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="card p-4 shadow-lg text-center border-0" style={{ maxWidth: "400px", borderRadius: "20px" }}>
          <div className="mb-3">
            <i className="fas fa-key fa-3x" style={{ color: "#F1A501" }}></i>
          </div>
          <h3 className="fw-bold mb-2" style={{ color: "#181E4B" }}>{forgotStep === 1 ? "Forgot Password?" : "Reset Password"}</h3>
          <p className="text-secondary mb-4">
            {forgotStep === 1
              ? "No worries! Enter your email and we'll send you an OTP to reset your password."
              : `We've sent a code to ${email}. Please enter it below along with your new password.`}
          </p>

          <form onSubmit={forgotStep === 1 ? handleForgotPassword : handleResetPassword}>
            {forgotStep === 1 ? (
              <div className="mb-4 text-start">
                <label className="form-label text-secondary small">Email Address</label>
                <input
                  type="email"
                  className="form-control py-2"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control text-center fs-4 fw-bold"
                    style={{ letterSpacing: '4px', borderRadius: '12px' }}
                    maxLength="6"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4 text-start">
                  <label className="form-label text-secondary small">New Password</label>
                  <input
                    type="password"
                    className="form-control py-2"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-warning w-100 fw-bold py-2 text-white"
              disabled={resetLoading}
              style={{ borderRadius: '10px' }}
            >
              {resetLoading ? "Processing..." : (forgotStep === 1 ? "Send Reset Link" : "Reset Password")}
            </button>
          </form>

          {forgotStep === 2 && (
            <div className="mt-3">
              <button
                className="btn btn-link text-decoration-none small text-secondary"
                onClick={() => handleResendOTP('forgot')}
                disabled={resendLoading}
              >
                {resendLoading ? "Sending..." : "Didn't get the code? Resend"}
              </button>
            </div>
          )}

          <button
            className="btn btn-link text-decoration-none mt-3 text-secondary small"
            onClick={() => { setShowForgot(false); setForgotStep(1); }}
          >
            ← Back to Login
          </button>

          {resendMessage && <p className="text-success mt-3 small fw-bold">{resendMessage}</p>}
          {error && <p className="text-danger mt-3 small">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center align-items-center position-relative" style={{ minHeight: "80vh" }}>

      {/* Back to Home */}
      <Link
        to="/"
        className="position-absolute top-0 start-0 m-4 text-decoration-none fw-bold"
        style={{ color: "#181E4B", fontSize: "1.1rem" }}
      >
        ← {t("backHome")}
      </Link>

      <div className="card p-4 shadow-sm responsive-card">
        <h2 className="text-center mb-4 fw-bold" style={{ color: "#181E4B" }}>
          {t("loginTitle")}
        </h2>

        {error && <p className="text-danger text-center">{error}</p>}
        {resetSuccess && (
          <div className="alert alert-success text-center animate-fade-in" style={{ borderRadius: '12px' }}>
            <i className="fas fa-check-circle me-2"></i> Password reset successful!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-secondary">{t("email")}</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-end">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none small-text fw-bold"
              style={{ color: "#DF6951", fontSize: '0.85rem' }}
              onClick={() => setShowForgot(true)}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold mt-2"
            style={{ backgroundColor: "#F1A501", color: "white" }}
          >
            {t("login")}
          </button>
        </form>

        <p className="text-center mt-3 text-secondary">
          {t("dontAccount")}{" "}
          <Link to="/signup" className="text-decoration-none fw-bold" style={{ color: "#DF6951" }}>
            {t("signup")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;