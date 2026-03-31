import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddFlight = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [flightData, setFlightData] = useState({
        airline: "",
        time: "",
        duration: "",
        type: "Non-stop",
        rating: 4.5,
        price: "",
        destination: "Udaipur"
    });

    const handleChange = (e) => {
        setFlightData({ ...flightData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const dataToSubmit = {
                ...flightData,
                price: Number(flightData.price),
                rating: Number(flightData.rating)
            };

            const res = await axios.post("http://localhost:5000/api/flights", dataToSubmit, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setSuccess(true);
                setTimeout(() => navigate("/admin"), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add flight");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-2">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="card-header bg-success text-white py-2 text-center">
                            <h4 className="mb-0 fw-bold"><i className="fas fa-plane me-2"></i>Add Flight</h4>
                        </div>
                        <div className="card-body p-3">
                            {success && (
                                <div className="alert alert-success py-2 mb-2">
                                    <i className="fas fa-check-circle me-2"></i> Flight added successfully!
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger py-2 mb-2">
                                    <i className="fas fa-exclamation-circle me-2"></i> {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-2">
                                    <label className="form-label fw-bold small mb-1">Airline Name</label>
                                    <input type="text" name="airline" className="form-control form-control-sm rounded-pill" placeholder="e.g. Indigo" value={flightData.airline} onChange={handleChange} required />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label fw-bold small mb-1">Destination Name</label>
                                    <input type="text" name="destination" className="form-control form-control-sm rounded-pill" placeholder="e.g. Udaipur" value={flightData.destination} onChange={handleChange} required />
                                </div>
                                <div className="row g-2">
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label fw-bold small mb-1">Departure Time</label>
                                        <input type="text" name="time" className="form-control form-control-sm rounded-pill" placeholder="09:00 AM" value={flightData.time} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label fw-bold small mb-1">Duration</label>
                                        <input type="text" name="duration" className="form-control form-control-sm rounded-pill" placeholder="2h 10m" value={flightData.duration} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="row g-2">
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label fw-bold small mb-1">Price (₹)</label>
                                        <input type="number" name="price" className="form-control form-control-sm rounded-pill" placeholder="5000" value={flightData.price} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label fw-bold small mb-1">Type</label>
                                        <select name="type" className="form-select form-select-sm rounded-pill" value={flightData.type} onChange={handleChange}>
                                            <option value="Non-stop">Non-stop</option>
                                            <option value="1 Stop">1 Stop</option>
                                            <option value="2+ Stops">2+ Stops</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="d-grid gap-2 mt-3">
                                    <button type="submit" className="btn btn-success btn-sm rounded-pill fw-bold" disabled={loading}>
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

export default AddFlight;
