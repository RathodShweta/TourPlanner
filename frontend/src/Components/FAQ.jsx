import React from "react";
import "../App.css";

const FAQ = () => {
  return (
    <div className="faq-container">
      <h2>❓ TourPlanner – Frequently Asked Questions</h2>

      <div className="faq-item">
        <h4>1. What is TourPlanner?</h4>
        <p>
          TourPlanner is a travel planning website where users can explore
          destinations, book hotels, search flights, and get travel guidance.
        </p>
      </div>

      <div className="faq-item">
        <h4>2. How can I book hotels?</h4>
        <p>
          Go to the Hotels section, choose your preferred hotel, select dates,
          and click on Book Stay.
        </p>
      </div>

      <div className="faq-item">
        <h4>3. Can I search flights?</h4>
        <p>
          Yes. Click on Flights, enter From, To, Date, and Passengers to search
          available flights.
        </p>
      </div>

      <div className="faq-item">
        <h4>4. Is TourPlanner available in Marathi & Hindi?</h4>
        <p>
          Yes. You can change language using the language dropdown in the
          navigation bar.
        </p>
      </div>

      <div className="faq-item">
        <h4>5. What is TourBot 🤖?</h4>
        <p>
          TourBot helps users with travel suggestions, destination ideas, and
          basic travel queries.
        </p>
      </div>

      <div className="faq-item">
        <h4>6. Do I need to create an account?</h4>
        <p>
          Login or Signup is required for booking and saving trips.
        </p>
      </div>
    </div>
  );
};

export default FAQ;
