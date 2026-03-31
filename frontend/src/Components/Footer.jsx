import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section about">
                    <h2 className="footer-logo">Tour<span>Planner</span></h2>
                    <p>Discover your next adventure with TourPlanner. We provide seamless travel experiences across India's most stunning destinations with luxury and style.</p>
                    <div className="social-links">
                        <a href="#" className="fb"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" className="tw"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="ig"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="yt"><i className="fab fa-youtube"></i></a>
                    </div>
                </div>

                <div className="footer-section links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/destinations">Destinations</Link></li>
                        <li><Link to="/hotels">Hotels</Link></li>
                        <li><Link to="/flights">Flights</Link></li>
                        <li><Link to="/faq">Safety Guide</Link></li>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h4>Contact Us</h4>
                    <ul className="contact-list">
                        <li><i className="fas fa-phone-alt"></i> +91 98765 43210</li>
                        <li><i className="fas fa-envelope"></i> info@tourplanner.com</li>
                        <li><i className="fas fa-map-marker-alt"></i> 123 Travel Lane, Mumbai, IN</li>
                    </ul>
                </div>


                <div className="footer-section newsletter">
                    <h4>Stay Updated</h4>
                    <p>Subscribe to get the latest travel deals and guides.</p>
                    <form className="newsletter-form">
                        <input type="email" placeholder="Enter your email" required />
                        <button type="submit" className="btn-subscribe">Sign Up</button>
                    </form>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} TourPlanner. All Rights Reserved. | Developed by Shweta Rathod
            </div>
        </footer>
    );
};

export default Footer;
