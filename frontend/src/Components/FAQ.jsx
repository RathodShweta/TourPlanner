import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const FAQ = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "General", "Booking", "Payments", "TourBot", "Technical"];

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/faqs");
      const sampleFaqs = [
        { _id: '1', question: "How do I book a tour package?", answer: "Go to the Destinations page, select your preferred location, and click 'Explore' to see available options and book.", category: "Booking" },
        { _id: '2', question: "What payment methods are accepted?", answer: "We accept all major credit/debit cards, UPI, and net banking for your convenience.", category: "Payments" },
        { _id: '3', question: "Can I cancel my booking?", answer: "Yes, you can cancel your booking from your profile dashboard. Cancellation fees may apply depending on the timing.", category: "Booking" },
        { _id: '4', question: "How can I contact support?", answer: "You can use our integrated Chat feature or the 'TourBot' for instant help, or email us at support@tourplanner.com.", category: "General" },
        { _id: '5', question: "Is my personal data secure?", answer: "Absolutely. We use industry-standard encryption to protect all your personal and payment information.", category: "General" },
        { _id: '6', question: "What is TourBot?", answer: "TourBot is our AI assistant designed to help you find destinations, check flight statuses, and answer common travel queries.", category: "TourBot" },
        { _id: '7', question: "How do I find cheap flights?", answer: "Check our Flights section regularly for 'Last Minute Deals' and use the filter to sort by 'Lowest Price'.", category: "Technical" },
        { _id: '8', question: "Do you offer group discounts?", answer: "Yes! For groups larger than 10 people, please contact our support team for specialized bulk rates.", category: "Payments" },
        { _id: '9', question: "Can I customize my itinerary?", answer: "Currently, our packages are pre-defined, but you can select individual hotels and flights to build your own trip.", category: "Booking" },
        { _id: '10', question: "What if my flight is delayed?", answer: "You can track real-time flight status in the Flights section. For booking adjustments, contact our 24/7 support.", category: "Technical" },
        { _id: '11', question: "Do I need a COVID-19 certificate?", answer: "Travel requirements vary by destination. Please check the 'Important Info' section of your selected destination.", category: "General" },
        { _id: '12', question: "How do I leave feedback?", answer: "After your trip, go to your Profile and select 'My Bookings' to leave a rating and review for your experience.", category: "General" }
      ];

      if (res.data.success && res.data.data.length > 0) {
        const combined = [...sampleFaqs, ...res.data.data];
        setFaqs(combined);
        setFilteredFaqs(combined);
      } else {
        setFaqs(sampleFaqs);
        setFilteredFaqs(sampleFaqs);
      }
    } catch (error) {
      console.error("Fetch FAQ error:", error);
      // Fallback to sample data on error
      const sampleFaqs = [
        { _id: '1', question: "How do I book a tour package?", answer: "Go to the Destinations page, select your preferred location, and click 'Explore' to see available options and book.", category: "Booking" },
        { _id: '2', question: "What payment methods are accepted?", answer: "We accept all major credit/debit cards, UPI, and net banking for your convenience.", category: "Payments" },
        { _id: '3', question: "Can I cancel my booking?", answer: "Yes, you can cancel your booking from your profile dashboard. Cancellation fees may apply depending on the timing.", category: "Booking" },
        { _id: '4', question: "How can I contact support?", answer: "You can use our integrated Chat feature or the 'TourBot' for instant help, or email us at support@tourplanner.com.", category: "General" },
        { _id: '5', question: "Is my personal data secure?", answer: "Absolutely. We use industry-standard encryption to protect all your personal and payment information.", category: "General" },
        { _id: '6', question: "What is TourBot?", answer: "TourBot is our AI assistant designed to help you find destinations, check flight statuses, and answer common travel queries.", category: "TourBot" },
        { _id: '7', question: "How do I find cheap flights?", answer: "Check our Flights section regularly for 'Last Minute Deals' and use the filter to sort by 'Lowest Price'.", category: "Technical" },
        { _id: '8', question: "Do you offer group discounts?", answer: "Yes! For groups larger than 10 people, please contact our support team for specialized bulk rates.", category: "Payments" },
        { _id: '9', question: "Can I customize my itinerary?", answer: "Currently, our packages are pre-defined, but you can select individual hotels and flights to build your own trip.", category: "Booking" },
        { _id: '10', question: "What if my flight is delayed?", answer: "You can track real-time flight status in the Flights section. For booking adjustments, contact our 24/7 support.", category: "Technical" },
        { _id: '11', question: "Do I need a COVID-19 certificate?", answer: "Travel requirements vary by destination. Please check the 'Important Info' section of your selected destination.", category: "General" },
        { _id: '12', question: "How do I leave feedback?", answer: "After your trip, go to your Profile and select 'My Bookings' to leave a rating and review for your experience.", category: "General" }
      ];
      setFaqs(sampleFaqs);
      setFilteredFaqs(sampleFaqs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const result = faqs.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredFaqs(result);
  }, [searchTerm, activeCategory, faqs]);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="faq-page-wrapper" style={{ marginTop: "40px", paddingBottom: "60px" }}>
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-5">
          <span className="badge bg-primary-soft text-primary px-3 py-2 rounded-pill mb-3 fw-bold">HELP CENTER</span>
          <h2 className="fw-bold display-6">Frequently Asked <span className="text-primary">Questions</span></h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Everything you need to know about your next adventure. Can't find the answer? Contact our 24/7 support.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="input-group mb-4 shadow-sm rounded-pill overflow-hidden border">
                <span className="input-group-text bg-white border-0 ps-4">
                  <i className="fas fa-search text-primary"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 py-3"
                  placeholder="Search for answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="d-flex flex-wrap justify-content-center gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`btn btn-sm rounded-pill px-4 py-2 fw-bold transition-all ${activeCategory === cat ? 'btn-primary shadow-sm' : 'btn-light text-secondary'}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Entries */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Showing {filteredFaqs.length} results</h5>
              {user?.isAdmin && (
                <button className="btn btn-primary btn-sm rounded-pill px-3 py-1 shadow-sm border-0 fw-bold" style={{ fontSize: '0.75rem' }} onClick={() => navigate("/admin/add-faq")}>
                  <i className="fas fa-plus me-1" style={{ fontSize: '0.7rem' }}></i> Add FAQ
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-grow text-primary" role="status"></div>
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
                <i className="far fa-lightbulb fs-1 text-muted mb-3 d-block"></i>
                <h5 className="text-muted">No matching questions found</h5>
                <button className="btn btn-link text-primary mt-2" onClick={() => { setSearchTerm(""); setActiveCategory("All"); }}>Reset Filters</button>
              </div>
            ) : (
              <div className="accordion accordion-flush rounded-4 shadow-sm overflow-hidden" id="faqAccordion">
                {filteredFaqs.map((faq, index) => (
                  <div className="accordion-item border-bottom" key={faq._id}>
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed py-4 fw-bold text-dark" type="button" data-bs-toggle="collapse" data-bs-target={`#faq-${index}`}>
                        {faq.question}
                      </button>
                    </h2>
                    <div id={`faq-${index}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body py-4 text-secondary lh-lg">
                        {faq.answer}
                        <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                          <span className="small text-muted">Category: <strong className="text-primary">{faq.category}</strong></span>
                          <div className="small">
                            <span className="me-2 text-muted">Was this helpful?</span>
                            <button className="btn btn-sm btn-outline-light text-dark border-0 rounded-pill px-2"><i className="far fa-thumbs-up me-1"></i> Yes</button>
                            <button className="btn btn-sm btn-outline-light text-dark border-0 rounded-pill px-2"><i className="far fa-thumbs-down me-1"></i> No</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="text-center mt-5 py-5 bg-primary rounded-5 text-white shadow-lg mx-auto" style={{ maxWidth: '800px' }}>
          <h3 className="fw-bold mb-3">Still have questions?</h3>
          <p className="mb-4 opacity-75">We can't find the answer you're looking for. Please chat to our friendly team.</p>
          <button className="btn btn-light rounded-pill px-5 py-3 fw-bold text-primary shadow" onClick={() => navigate("/Profile", { state: { tab: 'messages' } })}>
            Get In Touch <i className="fas fa-arrow-right ms-2"></i>
          </button>
        </div>
      </div>

      <style>{`
                .bg-primary-soft { background-color: rgba(79, 70, 229, 0.1); }
                .accordion-button:not(.collapsed) { background-color: transparent; color: #4f46e5; box-shadow: none; }
                .accordion-button:focus { box-shadow: none; border-color: rgba(0,0,0,.125); }
                .accordion-item { border-left: 0; border-right: 0; }
                .transition-all { transition: all 0.3s ease; }
            `}</style>
    </div>
  );
};

export default FAQ;
