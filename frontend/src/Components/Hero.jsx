import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import girls from "../assets/girls.png";
import "./Hero.css";

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="hero-section page-fade-in">
      <div className="hero-content">
        <div className="hero-text-area">
          <span className="hero-uptitle">{t("tagline")}</span>
          <h1 className="hero-main-title">
            {t("heroTitle1")} <br />
            {t("heroTitle2")} <br />
            {t("heroTitle3")}
          </h1>
          <p className="hero-paragraph">
            {t("heroDesc")}
          </p>
          <div className="hero-btns">
            <button className="btn-cta" onClick={() => navigate("/destinations")}>
              {t("findMore")}
            </button>
            <button className="btn-play">
              <span className="play-icon"><i className="fas fa-play"></i></span>
              Play Demo
            </button>
          </div>
        </div>

        <div className="hero-image-area">
          <div className="image-blob"></div>
          <img src={girls} alt="Traveler" className="hero-img" />
          <div className="plane-decoration-1">
            <i className="fas fa-paper-plane"></i>
          </div>
          <div className="plane-decoration-2">
            <i className="fas fa-paper-plane"></i>
          </div>
        </div>
      </div>

      {/* Decorative Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
    </section>
  );
};

export default Hero;
