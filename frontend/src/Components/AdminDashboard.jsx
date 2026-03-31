import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Import Destination Images for fallback
import goa1 from "../assets/destinations/goa_1.jpg";
import manali from "../assets/destinations/manali.jpg";
import shimla from "../assets/destinations/shimla.jpg";
import darjeeling from "../assets/destinations/darjeeling.jpg";
import andaman from "../assets/destinations/andaman.jpg";
import udaipur from "../assets/destinations/udaipur.jpg";
import jaipur from "../assets/destinations/jaipur.jpg";
import varanasi from "../assets/destinations/varanasi.jpg";
import goldenTemple from "../assets/destinations/golden_temple.jpg";
import tajMahal from "../assets/destinations/taj_mahal.jpg";
import hampi from "../assets/destinations/hampi.jpg";
import jimCorbett from "../assets/destinations/jim_corbett.jpg";
import alleppey from "../assets/destinations/alleppey.jpg";
import munnar from "../assets/destinations/munnar.jpg";
import lehLadakh from "../assets/destinations/leh_ladakh.jpg";
import rishikesh from "../assets/destinations/rishikesh.jpg";
import ooty from "../assets/destinations/ooty.jpg";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState({});
    const [sendingReply, setSendingReply] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    // Management Lists
    const [hotels, setHotels] = useState([]);
    const [flights, setFlights] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [destinations, setDestinations] = useState([]);

    const token = localStorage.getItem("token");

    const fallbackDestinations = [
        { _id: "d1", name: "Goa", state: "Goa", category: "Beach", price: "₹18,000", images: [goa1] },
        { _id: "d2", name: "Manali", state: "Himachal", category: "Adventure", price: "₹15,000", images: [manali] },
        { _id: "d3", name: "Shimla", state: "Himachal", category: "Honeymoon", price: "₹12,000", images: [shimla] },
        { _id: "d4", name: "Darjeeling", state: "West Bengal", category: "Nature", price: "₹14,500", images: [darjeeling] },
        { _id: "d5", name: "Andaman", state: "Andaman", category: "Honeymoon", price: "₹35,000", images: [andaman] },
        { _id: "d6", name: "Udaipur", state: "Rajasthan", category: "Heritage", price: "₹26,000", images: [udaipur] },
        { _id: "d7", name: "Jaipur", state: "Rajasthan", category: "Heritage", price: "₹10,000", images: [jaipur] },
        { _id: "d8", name: "Varanasi", state: "Uttar Pradesh", category: "Spiritual", price: "₹9,500", images: [varanasi] },
        { _id: "d9", name: "Golden Temple", state: "Punjab", category: "Spiritual", price: "₹7,000", images: [goldenTemple] },
        { _id: "d10", name: "Taj Mahal", state: "Uttar Pradesh", category: "Heritage", price: "₹5,000", images: [tajMahal] }
    ];

    const fallbackFlights = [
        { _id: "f1", airline: "IndiGo", destination: "Udaipur", time: "09:00 AM", duration: "2h 10m", price: 5300 },
        { _id: "f2", airline: "Air India", destination: "Manali", time: "12:45 PM", duration: "2h 30m", price: 4200 },
        { _id: "f3", airline: "Vistara", destination: "Goa", time: "04:20 PM", duration: "2h 05m", price: 6500 },
        { _id: "f4", airline: "SpiceJet", destination: "Shimla", time: "08:55 PM", duration: "2h 15m", price: 3800 }
    ];

    const fallbackFaqs = [
        { _id: "q1", question: "How do I book a tour?", answer: "Choose your destination and click 'Reserve This Experience'.", category: "Booking" },
        { _id: "q2", question: "Is lunch included?", answer: "Yes, in premium packages.", category: "General" },
        { _id: "q3", question: "What is TourBot?", answer: "Our AI travel assistant.", category: "TourBot" }
    ];

    const fallbackHotels = [
        { _id: "h1", name: "Taj Lake Palace", location: "Udaipur", pricePerNight: 45000, rating: 5.0 },
        { _id: "h2", name: "Snow Valley Resort", location: "Manali", pricePerNight: 8500, rating: 4.5 },
        { _id: "h3", name: "Mayfair Hideaway", location: "Goa", pricePerNight: 12000, rating: 4.7 }
    ];

    const fetchData = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };

            // Stats & Messages
            const statsRes = await fetch("http://localhost:5000/api/admin/stats", { headers });
            const statsData = await statsRes.json();
            if (statsRes.ok) setStats(statsData);

            const msgRes = await fetch("http://localhost:5000/api/messages/all", { headers });
            const msgData = await msgRes.json();
            if (msgRes.ok) setMessages(msgData.data || []);

            // Management Data
            const hotelRes = await fetch("http://localhost:5000/api/hotels");
            const hotelData = await hotelRes.json();
            if (hotelRes.ok) setHotels(hotelData.data?.length > 0 ? [...fallbackHotels, ...hotelData.data] : fallbackHotels);

            const flightRes = await fetch("http://localhost:5000/api/flights");
            const flightData = await flightRes.json();
            if (flightRes.ok) setFlights(flightData.data?.length > 0 ? [...fallbackFlights, ...flightData.data] : fallbackFlights);

            const faqRes = await fetch("http://localhost:5000/api/faqs");
            const faqData = await faqRes.json();
            if (faqRes.ok) setFaqs(faqData.data?.length > 0 ? [...fallbackFaqs, ...faqData.data] : fallbackFaqs);

            const destRes = await fetch("http://localhost:5000/api/destinations");
            const destData = await destRes.json();
            if (destRes.ok) setDestinations(destData.data?.length > 0 ? [...fallbackDestinations, ...destData.data] : fallbackDestinations);

        } catch (error) {
            console.error("Admin fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchData();
    }, [token, navigate]);

    const handleReplyChange = (id, text) => {
        setReplyText((prev) => ({ ...prev, [id]: text }));
    };

    const sendReply = async (messageId) => {
        const reply = replyText[messageId];
        if (!reply || !reply.trim()) return;

        setSendingReply(messageId);
        try {
            const res = await fetch("http://localhost:5000/api/messages/reply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ messageId, reply }),
            });

            if (res.ok) {
                handleReplyChange(messageId, "");
                fetchData();
            }
        } catch (error) {
            console.error("Reply error:", error);
        } finally {
            setSendingReply(null);
        }
    };

    if (loading) return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">Loading Admin Dashboard...</p>
        </div>
    );

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <div className="admin-sidebar bg-white shadow-sm border-end">
                <div className="p-3 border-bottom text-center">
                    <h5 className="fw-bold text-primary mb-0">TourPlanner</h5>
                    <p className="text-muted" style={{ fontSize: '0.65rem' }}>Admin Dashboard</p>
                </div>
                <div className="admin-nav p-3">
                    <button className={`nav-link-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                        <i className="fas fa-chart-line me-3"></i> Overview
                    </button>

                    <div className="nav-section-label">Bookings</div>
                    <button className={`nav-link-btn ${activeTab === 'hotel-bookings' ? 'active' : ''}`} onClick={() => setActiveTab('hotel-bookings')}>
                        <i className="fas fa-hotel me-3"></i> Hotel Bookings
                    </button>
                    <button className={`nav-link-btn ${activeTab === 'flight-bookings' ? 'active' : ''}`} onClick={() => setActiveTab('flight-bookings')}>
                        <i className="fas fa-plane me-3"></i> Flight Bookings
                    </button>

                    <div className="nav-section-label">Management</div>
                    <button className={`nav-link-btn ${activeTab === 'manage-hotels' ? 'active' : ''}`} onClick={() => setActiveTab('manage-hotels')}>
                        <i className="fas fa-building me-3"></i> Hotels
                    </button>
                    <button className={`nav-link-btn ${activeTab === 'manage-flights' ? 'active' : ''}`} onClick={() => setActiveTab('manage-flights')}>
                        <i className="fas fa-plane-departure me-3"></i> Flights
                    </button>
                    <button className={`nav-link-btn ${activeTab === 'manage-faq' ? 'active' : ''}`} onClick={() => setActiveTab('manage-faq')}>
                        <i className="fas fa-question-circle me-3"></i> FAQs
                    </button>
                    <button className={`nav-link-btn ${activeTab === 'manage-destinations' ? 'active' : ''}`} onClick={() => setActiveTab('manage-destinations')}>
                        <i className="fas fa-map-marked-alt me-3"></i> Destinations
                    </button>

                    <div className="nav-section-label">User Interactions</div>
                    <button className={`nav-link-btn ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
                        <i className="fas fa-envelope me-3"></i> Messages
                    </button>
                    <button className={`nav-link-btn ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>
                        <i className="fas fa-star me-3"></i> Feedback
                    </button>

                    <div className="mt-auto border-top pt-3 mt-5">
                        <Link to="/" className="nav-link-btn text-danger">
                            <i className="fas fa-sign-out-alt me-3"></i> Exit Admin
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-main p-3 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="fw-bold text-dark text-capitalize">
                        {activeTab.replace('-', ' ')}
                    </h2>
                    <div className="admin-user-info bg-white p-2 px-3 rounded-pill shadow-sm">
                        <i className="fas fa-user-circle me-2 text-primary"></i>
                        <span className="fw-bold">Administrator</span>
                    </div>
                </div>

                {/* CONTENT AREA */}
                {activeTab === 'overview' && (
                    <div className="animate-fade-in">
                        {/* Stats Cards */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-3">
                                <div className="stat-card">
                                    <div className="icon-box bg-blue"><i className="fas fa-hotel"></i></div>
                                    <div className="details">
                                        <p>Total Hotels</p>
                                        <h3>{hotels.length}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="stat-card">
                                    <div className="icon-box bg-green"><i className="fas fa-plane"></i></div>
                                    <div className="details">
                                        <p>Total Flights</p>
                                        <h3>{flights.length}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="stat-card">
                                    <div className="icon-box bg-orange"><i className="fas fa-map-marker-alt"></i></div>
                                    <div className="details">
                                        <p>Destinations</p>
                                        <h3>{destinations.length}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="stat-card">
                                    <div className="icon-box bg-red"><i className="fas fa-question-circle"></i></div>
                                    <div className="details">
                                        <p>FAQs</p>
                                        <h3>{faqs.length}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Row */}
                        <div className="row g-4">
                            <div className="col-md-7">
                                <div className="chart-container bg-white p-4 rounded-4 shadow-sm h-100">
                                    <h5 className="fw-bold mb-4">Activity Overview</h5>
                                    <div style={{ width: '100%', height: 350 }}>
                                        <ResponsiveContainer>
                                            <BarChart data={stats?.chartData || []}>
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="value" fill="#4f46e5" radius={[5, 5, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="chart-container bg-white p-4 rounded-4 shadow-sm h-100">
                                    <h5 className="fw-bold mb-4">Bookings Mix</h5>
                                    <div style={{ width: '100%', height: 350 }}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={stats?.chartData || []}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={80}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {stats?.chartData?.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Management Sections */}
                {activeTab === 'manage-hotels' && (
                    <div className="animate-fade-in">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Total Hotels Listed: {hotels.length}</h5>
                            <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate("/admin/add-hotel")}>
                                <i className="fas fa-plus me-2"></i> Add New Hotel
                            </button>
                        </div>
                        <div className="bg-white rounded-4 shadow-sm overflow-hidden">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Hotel Name</th>
                                            <th>Location</th>
                                            <th>Price/Night</th>
                                            <th>Rating</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hotels.map(hotel => (
                                            <tr key={hotel._id}>
                                                <td className="fw-bold">{hotel.name}</td>
                                                <td>{hotel.location}</td>
                                                <td>₹{hotel.pricePerNight}</td>
                                                <td><i className="fas fa-star text-warning me-1"></i>{hotel.rating}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-light rounded-circle me-2"><i className="fas fa-edit text-muted"></i></button>
                                                    <button className="btn btn-sm btn-light rounded-circle"><i className="fas fa-trash text-danger"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'manage-flights' && (
                    <div className="animate-fade-in">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Total Flights Listed: {flights.length}</h5>
                            <button className="btn btn-success rounded-pill px-4" onClick={() => navigate("/admin/add-flight")}>
                                <i className="fas fa-plus me-2"></i> Add New Flight
                            </button>
                        </div>
                        <div className="bg-white rounded-4 shadow-sm overflow-hidden">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Airline</th>
                                            <th>Destination</th>
                                            <th>Time / Duration</th>
                                            <th>Price</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {flights.map(flight => (
                                            <tr key={flight._id}>
                                                <td className="fw-bold"><i className="fas fa-plane me-2 text-primary"></i>{flight.airline}</td>
                                                <td>{flight.destination}</td>
                                                <td>{flight.time} <span className="text-muted small">({flight.duration})</span></td>
                                                <td>₹{flight.price}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-light rounded-circle"><i className="fas fa-trash text-danger"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'manage-faq' && (
                    <div className="animate-fade-in">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Total FAQs: {faqs.length}</h5>
                            <button className="btn btn-warning rounded-pill px-4" onClick={() => navigate("/admin/add-faq")}>
                                <i className="fas fa-plus me-2"></i> Add New FAQ
                            </button>
                        </div>
                        <div className="row g-3">
                            {faqs.map(faq => (
                                <div className="col-12" key={faq._id}>
                                    <div className="card shadow-sm border-0 rounded-4 p-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6 className="fw-bold mb-0 text-primary">{faq.question}</h6>
                                            <span className="badge bg-light text-muted fw-normal">{faq.category}</span>
                                        </div>
                                        <p className="small text-secondary mb-0">{faq.answer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'manage-destinations' && (
                    <div className="animate-fade-in">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Total Destinations: {destinations.length}</h5>
                            <Link to="/admin/add-destination" className="btn btn-info text-white rounded-pill px-4">
                                <i className="fas fa-plus me-2"></i> Add New Destination
                            </Link>
                        </div>
                        <div className="row g-4">
                            {destinations.map(dest => (
                                <div className="col-md-4" key={dest._id}>
                                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                                        <img src={dest.images?.[0]} className="card-img-top" style={{ height: '150px', objectFit: 'cover' }} alt={dest.name} />
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between">
                                                <h6 className="fw-bold">{dest.name}</h6>
                                                <small className="text-muted">{dest.state}</small>
                                            </div>
                                            <div className="mt-2">
                                                <span className="badge bg-light text-primary me-2">{dest.category}</span>
                                                <span className="badge bg-light text-success">{dest.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reports / Bookings Sections */}
                {activeTab === 'hotel-bookings' && (
                    <div className="bg-white rounded-4 shadow-sm overflow-hidden animate-fade-in">
                        <div className="p-4 border-bottom">
                            <h5 className="fw-bold mb-0">Recent Hotel Bookings</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th>User</th>
                                        <th>Hotel</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.details?.hotelBookings?.map((booking) => (
                                        <tr key={booking._id}>
                                            <td>
                                                <div className="fw-bold">{booking.user?.name}</div>
                                                <small className="text-muted">{booking.user?.email}</small>
                                            </td>
                                            <td>{booking.hotel?.name}</td>
                                            <td>{booking.travelDate}</td>
                                            <td className="fw-bold text-success">₹{booking.totalAmount}</td>
                                            <td><span className={`badge rounded-pill ${booking.status === 'success' ? 'bg-success' : 'bg-warning'}`}>{booking.status}</span></td>
                                        </tr>
                                    ))}
                                    {(!stats?.details?.hotelBookings || stats.details.hotelBookings.length === 0) && (
                                        <tr><td colSpan="5" className="text-center py-4 text-muted">No hotel bookings found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'flight-bookings' && (
                    <div className="bg-white rounded-4 shadow-sm overflow-hidden animate-fade-in">
                        <div className="p-4 border-bottom">
                            <h5 className="fw-bold mb-0">Recent Flight Bookings</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Passenger</th>
                                        <th>Airline</th>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.details?.flightBookings?.map((booking) => (
                                        <tr key={booking._id}>
                                            <td className="fw-bold">{booking.passengerName}</td>
                                            <td>{booking.airline}</td>
                                            <td>{booking.journeyDate}</td>
                                            <td>{booking.seatType}</td>
                                            <td className="fw-bold text-success">₹{booking.totalAmount}</td>
                                        </tr>
                                    ))}
                                    {(!stats?.details?.flightBookings || stats.details.flightBookings.length === 0) && (
                                        <tr><td colSpan="5" className="text-center py-4 text-muted">No flight bookings found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="bg-white rounded-4 shadow-sm overflow-hidden animate-fade-in">
                        <div className="p-4 border-bottom">
                            <h5 className="fw-bold mb-0">Inquiries & Support</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Sender</th>
                                        <th>Content</th>
                                        <th>Admin Reply</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.map((msg) => (
                                        <tr key={msg._id}>
                                            <td className="fw-bold">{msg.sender?.name}</td>
                                            <td style={{ maxWidth: '300px' }}>{msg.content}</td>
                                            <td>
                                                {msg.reply ? (
                                                    <span className="text-success fw-bold"><i className="fas fa-check me-2"></i>Replied</span>
                                                ) : (
                                                    <div className="d-flex gap-2">
                                                        <input className="form-control form-control-sm" placeholder="Reply..." value={replyText[msg._id] || ""} onChange={(e) => handleReplyChange(msg._id, e.target.value)} />
                                                        <button className="btn btn-primary btn-sm" onClick={() => sendReply(msg._id)} disabled={sendingReply === msg._id}>Send</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'feedback' && (
                    <div className="row g-4 animate-fade-in">
                        {stats?.details?.feedbacks?.map((f) => (
                            <div className="col-md-6" key={f._id}>
                                <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                                    <div className="d-flex justify-content-between mb-2">
                                        <div className="fw-bold">{f.user?.name || "Guest User"}</div>
                                        <div className="text-warning">
                                            {[...Array(f.rating)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                                        </div>
                                    </div>
                                    <p className="text-secondary small mb-0 fst-italic">"{f.comment}"</p>
                                    <div className="text-end">
                                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                            {new Date(f.createdAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!stats?.details?.feedbacks || stats.details.feedbacks.length === 0) && (
                            <div className="col-12 text-center py-5">
                                <i className="far fa-frown fs-1 text-muted mb-3"></i>
                                <p className="text-muted">No feedbacks submitted yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>
                {`
                    .admin-layout { display: flex; min-height: 100vh; }
                    .admin-sidebar { width: 230px; position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; overflow-y: auto; z-index: 100; }
                    .admin-main { flex: 1; min-width: 0; }
                    
                    .nav-link-btn { width: 100%; text-align: left; background: none; border: none; padding: 12px 20px; border-radius: 12px; font-weight: 500; color: #64748b; transition: all 0.2s; text-decoration: none; display: block; margin-bottom: 4px; }
                    .nav-link-btn:hover { background: #f1f5f9; color: #0f172a; }
                    .nav-link-btn.active { background: #4f46e5; color: white; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25); }
                    
                    .nav-section-label { font-size: 0.7rem; text-transform: uppercase; font-weight: 700; color: #94a3b8; padding: 15px 20px 5px; }
                    
                    .stat-card { background: white; padding: 15px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: flex; align-items: center; gap: 12px; border: 1px solid #f1f5f9; }
                    .stat-card .icon-box { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; color: white; }
                    .stat-card .bg-blue { background: #3b82f6; }
                    .stat-card .bg-green { background: #10b981; }
                    .stat-card .bg-orange { background: #f59e0b; }
                    .stat-card .bg-red { background: #ef4444; }
                    .stat-card .details p { color: #64748b; font-size: 0.85rem; margin-bottom: 0px; }
                    .stat-card .details h3 { font-weight: 800; margin-bottom: 0px; }

                    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                    @media (max-width: 992px) {
                        .admin-sidebar { display: none; }
                    }
                `}
            </style>
        </div>
    );
};

export default AdminDashboard;
