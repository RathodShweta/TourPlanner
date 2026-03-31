import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddFAQ = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [faqData, setFaqData] = useState({
        question: "",
        answer: "",
        category: "General"
    });

    const handleChange = (e) => {
        setFaqData({ ...faqData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post("http://localhost:5000/api/faqs", faqData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setSuccess(true);
                setTimeout(() => navigate("/admin"), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add FAQ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-2">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="card-header bg-warning text-white py-2 text-center">
                            <h4 className="mb-0 fw-bold text-dark"><i className="fas fa-question-circle me-2"></i>Add FAQ</h4>
                        </div>
                        <div className="card-body p-3">
                            {success && (
                                <div className="alert alert-success py-2 mb-2">
                                    <i className="fas fa-check-circle me-2"></i> FAQ added successfully!
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger py-2 mb-2">
                                    <i className="fas fa-exclamation-circle me-2"></i> {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-2">
                                    <label className="form-label fw-bold small mb-1">Question</label>
                                    <input type="text" name="question" className="form-control form-control-sm rounded-pill" placeholder="e.g. How can I cancel?" value={faqData.question} onChange={handleChange} required />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label fw-bold small mb-1">Answer</label>
                                    <textarea name="answer" className="form-control form-control-sm rounded-3" rows="3" placeholder="Detailed answer..." value={faqData.answer} onChange={handleChange} required></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small mb-1">Category</label>
                                    <select name="category" className="form-select form-select-sm rounded-pill" value={faqData.category} onChange={handleChange} required>
                                        <option value="General">General</option>
                                        <option value="Booking">Booking</option>
                                        <option value="Payments">Payments</option>
                                        <option value="TourBot">TourBot</option>
                                        <option value="Technical">Technical</option>
                                    </select>
                                </div>
                                <div className="d-grid gap-2 mt-3">
                                    <button type="submit" className="btn btn-warning btn-sm rounded-pill fw-bold text-dark" disabled={loading}>
                                        {loading ? "Adding..." : "Add FAQ Entry"}
                                    </button>
                                    <button type="button" className="btn btn-link btn-sm text-decoration-none" onClick={() => navigate(-1)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddFAQ;
