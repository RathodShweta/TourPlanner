import React from "react";
import "./Services.css";

const Services = () => {
    const services = [
        {
            icon: "fas fa-map-marked-alt",
            title: "Expert Guides",
            desc: "Get insights from local experts who know every hidden gem."
        },
        {
            icon: "fas fa-hotel",
            title: "Luxury Stays",
            desc: "Handpicked premium hotels for ultimate comfort during your trip."
        },
        {
            icon: "fas fa-plane-departure",
            title: "Easy Flight Booking",
            desc: "Best deals on domestic and international flights."
        },
        {
            icon: "fas fa-shield-alt",
            title: "Safe & Secure",
            desc: "Verified travel and secure payment options for peace of mind."
        }
    ];

    return (
        <section className="services-section">
            <div className="section-header">
                <p className="subtitle">CATEGORY</p>
                <h2 className="title">We Offer Best Services</h2>
            </div>
            <div className="services-grid">
                {services.map((service, index) => (
                    <div className="service-card" key={index}>
                        <div className="icon-wrapper">
                            <i className={service.icon}></i>
                        </div>
                        <h3>{service.title}</h3>
                        <p>{service.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Services;
