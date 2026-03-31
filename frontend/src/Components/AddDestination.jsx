import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddDestination = () => {
    const [destination, setDestination] = useState({
        name: "",
        state: "",
        season: "Summer",
        bestSeason: "",
        duration: "",
        budgetType: "Medium",
        price: "",
        category: "Beach",
        desc: "",
        images: [""]
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setDestination({ ...destination, [e.target.name]: e.target.value });
    };

    const handleImageChange = (index, value) => {
        const newImages = [...destination.images];
        newImages[index] = value;
        setDestination({ ...destination, images: newImages });
    };

    const addImageField = () => {
        setDestination({ ...destination, images: [...destination.images, ""] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/destinations", destination, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Destination added successfully!");
            navigate("/admin");
        } catch (error) {
            console.error(error);
            alert("Error adding destination");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-2">
            <div className="row justify-content-center">
                <div className="col-md-7">
                    <div className="card border-0 shadow-lg rounded-4 p-3">
                        <h4 className="fw-bold mb-3 text-center">Add Destination</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small mb-1">Name</label>
                                    <input type="text" name="name" className="form-control form-control-sm rounded-pill" required onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small mb-1">State</label>
                                    <input type="text" name="state" className="form-control form-control-sm rounded-pill" required onChange={handleChange} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold small mb-1">Season</label>
                                    <select name="season" className="form-select form-select-sm rounded-pill" onChange={handleChange}>
                                        <option value="Summer">Summer</option>
                                        <option value="Winter">Winter</option>
                                        <option value="Monsoon">Monsoon</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold small mb-1">Best Months</label>
                                    <input type="text" name="bestSeason" className="form-control form-control-sm rounded-pill" required onChange={handleChange} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold small mb-1">Duration</label>
                                    <input type="text" name="duration" className="form-control form-control-sm rounded-pill" placeholder="e.g. 4-5 Days" required onChange={handleChange} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold small mb-1">Budget</label>
                                    <select name="budgetType" className="form-select form-select-sm rounded-pill" onChange={handleChange}>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold small mb-1">Price Range</label>
                                    <input type="text" name="price" className="form-control form-control-sm rounded-pill" placeholder="e.g. ₹15,000" required onChange={handleChange} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold small mb-1">Category</label>
                                    <select name="category" className="form-select form-select-sm rounded-pill" onChange={handleChange}>
                                        <option value="Beach">Beach</option>
                                        <option value="Mountain">Mountain</option>
                                        <option value="Adventure">Adventure</option>
                                        <option value="Heritage">Heritage</option>
                                        <option value="City">City</option>
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-bold small mb-1">Description</label>
                                    <textarea name="desc" className="form-control form-control-sm rounded-3" rows="2" required onChange={handleChange}></textarea>
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-bold small mb-1">Images</label>
                                    <div className="row g-2">
                                        {destination.images.map((img, idx) => (
                                            <div className="col-md-6" key={idx}>
                                                <input type="text" className="form-control form-control-sm rounded-pill" placeholder={`URL ${idx + 1}`} value={img} onChange={(e) => handleImageChange(idx, e.target.value)} />
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" className="btn btn-sm btn-link py-0 text-decoration-none" onClick={addImageField}>+ Add More</button>
                                </div>
                            </div>
                            <div className="mt-3 d-flex gap-2">
                                <button type="submit" className="btn btn-primary btn-sm rounded-pill flex-grow-1 fw-bold" disabled={loading}>
                                    {loading ? "Saving..." : "Save Destination"}
                                </button>
                                <button type="button" className="btn btn-light btn-sm rounded-pill px-3" onClick={() => navigate("/admin")}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDestination;
