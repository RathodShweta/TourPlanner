import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        setError(data.message || "Login failed");
        return;
      }

      // ✅ save token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ redirect to home
      navigate("/");

    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 position-relative">

      {/* Back to Home */}
      <Link
        to="/"
        className="position-absolute top-0 start-0 m-4 text-decoration-none fw-bold"
        style={{ color: "#181E4B", fontSize: "1.1rem" }}
      >
        ← {t("backHome")}
      </Link>

      <div className="card p-4 shadow-sm" style={{ width: "400px", borderRadius: "15px" }}>
        <h2 className="text-center mb-4 fw-bold" style={{ color: "#181E4B" }}>
          {t("loginTitle")}
        </h2>

        {error && <p className="text-danger text-center">{error}</p>}

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