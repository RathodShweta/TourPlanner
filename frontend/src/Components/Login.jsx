import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 position-relative">
      
      {/* Back to Home Link */}
      <Link
        to="/"
        className="position-absolute top-0 start-0 m-4 text-decoration-none fw-bold"
        style={{ color: "#181E4B", fontSize: "1.1rem" }}
      >
        ← {t("backHome")}
      </Link>

      <div
        className="card p-4 shadow-sm"
        style={{ width: "400px", borderRadius: "15px" }}
      >
        <h2
          className="text-center mb-4 fw-bold"
          style={{ color: "#181E4B" }}
        >
          {t("loginTitle")}
        </h2>

        <form>
          <div className="mb-3">
            <label className="form-label text-secondary">
              {t("email")}
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary">
              {t("password")}
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
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
          <Link
            to="/signup"
            className="text-decoration-none fw-bold"
            style={{ color: "#DF6951" }}
          >
            {t("signup")}
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;