import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddHotel = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [hotelData, setHotelData] = useState({
        name: "",
        location: "",
        pricePerNight: "",
        mapSrc: "",
        images: "",
        rating: 4.5
    });

    const handleChange = (e) => {
        setHotelData({ ...hotelData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const dataToSubmit = {
                ...hotelData,
                images: hotelData.images.split(",").map(img => img.trim()),
                pricePerNight: Number(hotelData.pricePerNight),
                rating: Number(hotelData.rating)
            };

            const res = await axios.post("http://localhost:5000/api/hotels", dataToSubmit, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setSuccess(true);
                setTimeout(() => navigate("/admin"), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add hotel");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-2">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="card-header bg-primary text-white py-2 text-center">
                            <h4 className="mb-0 fw-bold"><i className="fas fa-plus-circle me-2"></i>Add Hotel</h4>
                        </div>
                        <div className="card-body p-3">
                            {success && (
                                <div className="alert alert-success py-2 mb-2">
                                    <i className="fas fa-check-circle me-2"></i> Hotel added successfully!
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger py-2 mb-2">
                                    <i className="fas fa-exclamation-circle me-2"></i> {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-2">
                                    <label className="form-label fw-bold small mb-1">Hotel Name</label>
                                    <input type="text" name="name" className="form-control form-control-sm rounded-pill" placeholder="e.g. Taj Mahal Palace" value={hotelData.name} onChange={handleChange} required />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label fw-bold small mb-1">Location</label>
                                    <input type="text" name="location" className="form-control form-control-sm rounded-pill" placeholder="e.g. Mumbai, Maharashtra" value={hotelData.location} onChange={handleChange} required />
                                </div>
                                <div className="row g-2">
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label fw-bold small mb-1">Price / Night (₹)</label>
                                        <input type="number" name="pricePerNight" className="form-control form-control-sm rounded-pill" placeholder="e.g. 15000" value={hotelData.pricePerNight} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label fw-bold small mb-1">Rating (1-5)</label>
                                        <input type="number" step="0.1" max="5" min="0" name="rating" className="form-control form-control-sm rounded-pill" value={hotelData.rating} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label fw-bold small mb-1">Map Embed URL</label>
                                    <input type="text" name="mapSrc" className="form-control form-control-sm rounded-pill" placeholder="https://..." value={hotelData.mapSrc} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small mb-1">Image URLs (comma sep)</label>
                                    <textarea name="images" className="form-control form-control-sm rounded-3" rows="2" placeholder="url1, url2" value={hotelData.images} onChange={handleChange} required></textarea>
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary btn-sm rounded-pill fw-bold" disabled={loading}>
                                        {loading ? "Adding..." : "Create Listing"}
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

export default AddHotel;
