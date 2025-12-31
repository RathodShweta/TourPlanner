import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Signup = () => {
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
        style={{ width: "450px", borderRadius: "15px" }}
      >
        <h2
          className="text-center mb-4 fw-bold"
          style={{ color: "#181E4B" }}
        >
          {t("join")}
        </h2>

        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-secondary">
                {t("firstName")}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="John"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label text-secondary">
                {t("lastName")}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary">
              {t("email")}
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="john@example.com"
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
              placeholder={t("createPassword")}
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
          <Link
            to="/login"
            className="text-decoration-none fw-bold"
            style={{ color: "#DF6951" }}
          >
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
