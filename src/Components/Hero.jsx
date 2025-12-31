import React from "react";
import { useTranslation } from "react-i18next";
import girls from "../assets/girls.png";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="hero-text">
        <p className="tagline">{t("tagline")}</p>

        <h1>
          {t("heroTitle1")} <br />
          {t("heroTitle2")} <br />
          {t("heroTitle3")}
        </h1>

        <p className="description">{t("heroDesc")}</p>

        <button className="btn-primary">
          {t("findMore")}
        </button>
      </div>

      <div className="hero-image">
        <div className="bg-shape"></div>
        <img src={girls} alt="Travel" />
      </div>
    </section>
  );
};

export default Hero;
