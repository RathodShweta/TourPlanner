import React from "react";
import Hero from "./Hero";
import Services from "./Services";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Home.css";

// Reuse some destination images to show "featured"
import tajMahal from "../assets/destinations/taj_mahal.jpg";
import andaman from "../assets/destinations/andaman.jpg";
import lehLadakh from "../assets/destinations/leh_ladakh.jpg";

const Home = () => {
    const { t } = useTranslation();
    const [email, setEmail] = React.useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            alert("Thank you for subscribing! Check your email for a welcome gift. 🎁");
            setEmail("");
        }
    };

    const featuredList = [
        { name: t("tajMahalTitle"), img: tajMahal, price: "₹5,000", days: "2 Days Trip", rating: 4.9 },
        { name: t("andamanTitle"), img: andaman, price: "₹35,000", days: "7 Days Trip", rating: 4.7 },
        { name: t("lehLadakhTitle"), img: lehLadakh, price: "₹40,000", days: "10 Days Trip", rating: 4.8 }
    ];

    return (
        <div className="home-container page-fade-in">
            <Hero />

            <Services />

            {/* Featured Destinations Section */}
            <section className="featured-section">
                <div className="section-header">
                    <p className="subtitle">{t("topSelling")}</p>
                    <h2 className="title">{t("topDestinations")}</h2>
                </div>

                <div className="featured-grid">
                    {featuredList.map((item, index) => (
                        <div className="featured-card" key={index}>
                            <div className="card-image">
                                <img src={item.img} alt={item.name} loading="lazy" />
                            </div>
                            <div className="card-info">
                                <div className="info-header">
                                    <h4>{item.name}</h4>
                                    <span>{item.price}</span>
                                </div>
                                <div className="info-footer">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="fas fa-paper-plane"></i>
                                        <span>{item.days}</span>
                                    </div>
                                    <span className="home-rating"><i className="fas fa-star text-warning"></i> {item.rating}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-5">
                    <Link to="/destinations" className="btn-secondary">{t("exploreAll")}</Link>
                </div>
            </section>

            {/* Top Rated Recommendations */}
            <section className="recommendations-section">
                <div className="container">
                    <div className="section-header text-center mb-5">
                        <p className="subtitle" style={{ color: '#f59e0b' }}>{t("bestForYou")}</p>
                        <h2 className="title">{t("recStaysFlights")}</h2>
                    </div>

                    <div className="recommendations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                        {/* High Rated Hotel Card */}
                        <div className="rec-card hotel-rec">
                            <div className="rec-badge"><i className="fas fa-crown"></i> Top Rated Stay</div>
                            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Luxury Hotel" />
                            <div className="rec-content">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="rec-type">{t("navHotels")}</span>
                                    <span className="rec-rating"><i className="fas fa-star text-warning"></i> 4.9</span>
                                </div>
                                <h4>The Grand Residency</h4>
                                <p className="text-muted small"><i className="fas fa-map-marker-alt"></i> Udaipur, Rajasthan</p>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span className="rec-price">₹8,400 <small>/night</small></span>
                                    <Link to="/hotels" className="rec-btn">{t("bookNow")}</Link>
                                </div>
                            </div>
                        </div>

                        {/* High Rated Flight Card */}
                        <div className="rec-card flight-rec">
                            <div className="rec-badge" style={{ backgroundColor: '#3b82f6' }}><i className="fas fa-award"></i> Best Experience</div>
                            <div className="flight-icon-backdrop">✈️</div>
                            <div className="rec-content">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="rec-type">{t("navFlights")}</span>
                                    <span className="rec-rating"><i className="fas fa-star text-warning"></i> 4.9</span>
                                </div>
                                <h4>Vistara • Premium Economy</h4>
                                <p className="text-muted small">Mumbai to Andaman • Non-stop</p>
                                <div className="rec-flight-info mt-3 p-2 bg-light rounded">
                                    <div className="d-flex justify-content-between small text-dark fw-bold">
                                        <span>Departure: 04:20 PM</span>
                                        <span>Duration: 2h 05m</span>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span className="rec-price">₹12,500 <small>/info</small></span>
                                    <Link to="/FlightBooking" className="rec-btn" style={{ backgroundColor: '#3b82f6' }}>View Flights</Link>
                                </div>
                            </div>
                        </div>

                        {/* Another High Rated Hotel Card */}
                        <div className="rec-card hotel-rec">
                            <div className="rec-badge"><i className="fas fa-crown"></i> High Satisfaction</div>
                            <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Resort Hotel" />
                            <div className="rec-content">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="rec-type">{t("navHotels")}</span>
                                    <span className="rec-rating"><i className="fas fa-star text-warning"></i> 4.8</span>
                                </div>
                                <h4>Marine Bay Resort</h4>
                                <p className="text-muted small"><i className="fas fa-map-marker-alt"></i> Port Blair, Andaman</p>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span className="rec-price">₹11,200 <small>/night</small></span>
                                    <Link to="/hotels" className="rec-btn">{t("bookNow")}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter section */}
            <section className="newsletter-section">
                <div className="newsletter-box">
                    <h3>{t("newsletterTitle")}</h3>
                    <form className="newsletter-input" onSubmit={handleSubscribe}>
                        <i className="far fa-envelope"></i>
                        <input
                            type="email"
                            placeholder={t("yourEmail")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-subscribe-cta">{t("subscribe")}</button>
                    </form>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;