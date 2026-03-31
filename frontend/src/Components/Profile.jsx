import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import "./Profile.css";

const AdminStatsTab = ({ token, navigate }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (err) {
        console.error("Stats error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <div className="text-center p-5"><i className="fas fa-spinner fa-spin fs-1"></i></div>;

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b'];

  return (
    <div className="admin-stats-tab animate-fade-in">
      <div className="section-title">
        <i className="fas fa-chart-bar" style={{ color: '#4f46e5' }}></i>
        Admin Business Overview
      </div>

      <div className="stats-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="details-card" style={{ padding: '20px', borderLeft: '4px solid #4f46e5' }}>
          <small className="text-muted text-uppercase fw-bold">Hotels</small>
          <h2 className="mb-0">{stats?.counts?.hotels || 0}</h2>
        </div>
        <div className="details-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <small className="text-muted text-uppercase fw-bold">Flights</small>
          <h2 className="mb-0">{stats?.counts?.flights || 0}</h2>
        </div>
        <div className="details-card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <small className="text-muted text-uppercase fw-bold">Feedbacks</small>
          <h2 className="mb-0">{stats?.counts?.feedbacks || 0}</h2>
        </div>
      </div>

      <div className="details-card mb-4" style={{ padding: '24px' }}>
        <h4 className="mb-4">Platform Growth Chart</h4>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer>
            <BarChart data={stats?.chartData || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {stats?.chartData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="details-card" style={{ padding: '24px' }}>
        <h4 className="mb-4">Recent Bookings Details</h4>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr className="text-muted">
                <th className="fw-normal border-0 ps-0">User</th>
                <th className="fw-normal border-0">Hotel</th>
                <th className="fw-normal border-0">Date</th>
                <th className="fw-normal border-0 text-end pe-0">Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats?.details?.hotelBookings?.slice(0, 5).map(b => (
                <tr key={b._id}>
                  <td className="ps-0 py-3">
                    <div className="fw-bold">{b.user?.name}</div>
                    <small className="text-muted">{b.user?.email}</small>
                  </td>
                  <td>{b.hotel?.name}</td>
                  <td>{b.travelDate}</td>
                  <td className="text-end fw-bold text-success pe-0">₹{b.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn-edit-profile w-100" onClick={() => navigate("/admin")}>View All in Dashboard</button>
        </div>
      </div>
    </div>
  );
};

const MessagesTab = ({ token, user, navigate }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/messages/user-messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const formattedMessages = [];
        data.data.forEach((msg) => {
          formattedMessages.push({
            id: msg._id + "_user",
            text: msg.content,
            sender: "user",
            timestamp: msg.createdAt,
          });
          if (msg.reply) {
            formattedMessages.push({
              id: msg._id + "_admin",
              text: msg.reply,
              sender: "admin",
              timestamp: msg.repliedAt || msg.updatedAt,
            });
          }
        });
        formattedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Fetch chat error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      });
      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  return (
    <div className="support-section animate-fade-in">
      <div className="chat-dashboard-container">
        {/* Chat Window Area (Single Column) */}
        <div className="chat-main-view">
          <div className="chat-view-header">
            <div className="chat-header-user">
              <h4>Admin Desk</h4>
            </div>
          </div>

          <div className="chat-messages-area">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}><i className="fas fa-spinner fa-spin"></i></div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '100px 40px', color: '#94a3b8' }}>
                <i className="fas fa-comments" style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.3 }}></i>
                <p>{t("profStartConversation") || "Start a conversation with Admin Support"}</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <React.Fragment key={msg.id}>
                  {/* Optional Date Divider */}
                  {index === 0 || new Date(messages[index - 1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString() ? (
                    <span className="dash-msg-time">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  ) : null}

                  <div className={`msg-wrapper ${msg.sender === "user" ? "outbound" : "inbound"}`}>
                    <img
                      src={msg.sender === "user"
                        ? (user?.photo ? `http://localhost:5000/profile_photos/${user.photo}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png")
                        : "https://ui-avatars.com/api/?name=J+C&background=7c9aff&color=fff"
                      }
                      className="msg-avatar"
                      alt="Avatar"
                    />
                    <div className={`dash-message ${msg.sender === "user" ? "outbound" : "inbound"}`}>
                      {msg.text}
                    </div>
                  </div>
                </React.Fragment>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="dash-chat-footer" onSubmit={handleSendMessage}>
            <div className="dash-input-wrapper">
              <input
                type="text"
                placeholder={t("profTypeMessage") || "Type a message..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </div>
            <div className="footer-icon-group">
              <button type="button" className="footer-icon-btn">
                <i className="fas fa-paperclip"></i>
              </button>
              <button type="button" className="footer-icon-btn">
                <i className="far fa-smile"></i>
              </button>
              <button type="submit" className="footer-icon-btn" style={{ color: newMessage.trim() ? '#8194ff' : '#94a3b8' }}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const FeedbackTab = ({ token }) => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Stats can be static or hardcoded for visualization
  const bookingExpData = [
    { name: 'Excellent', value: 45, fill: '#22c55e' },
    { name: 'Good', value: 30, fill: '#84cc16' },
    { name: 'Fair', value: 15, fill: '#eab308' },
    { name: 'Poor', value: 10, fill: '#ef4444' },
  ];

  const easeOfUseData = [
    { name: 'Very Easy', count: 50 },
    { name: 'Easy', count: 35 },
    { name: 'Neutral', count: 10 },
    { name: 'Difficult', count: 5 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Feedback error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-section animate-fade-in">
      <div className="section-title">
        <i className="fas fa-poll-h" style={{ color: '#4f46e5' }}></i>
        Community Feedback Insights
      </div>

      <div className="details-card feedback-promo-card" style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        color: 'white',
        marginBottom: '30px',
        padding: '30px',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)'
      }}>
        {!showForm && !submitted ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ maxWidth: '65%' }}>
              <h3 style={{ color: 'white', margin: '0 0 10px', fontSize: '1.5rem' }}>{t("profHelpUsImprove")}</h3>
              <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '1rem' }}>
                {t("profFeedbackDesc")}
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              style={{
                background: 'white',
                border: 'none',
                color: '#4f46e5',
                padding: '12px 28px',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'transform 0.2s ease'
              }}
            >
              {t("profGiveFeedback")} <i className="fas fa-star text-warning"></i>
            </button>
          </div>
        ) : submitted ? (
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <i className="fas fa-check-circle" style={{ fontSize: '3rem', marginBottom: '15px' }}></i>
            <h3 style={{ color: 'white' }}>{t("profThankYouFeedback")}</h3>
            <p>{t("profSubmissionReceived")}</p>
            <button onClick={() => setSubmitted(false)} className="btn btn-sm btn-light mt-3" style={{ borderRadius: '8px' }}>{t("profSendAnother")}</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <h3 style={{ color: 'white', marginBottom: '20px' }}>{t("profWhatsOnMind")}</h3>
            <div className="mb-4 text-center">
              <label className="d-block mb-3 opacity-75">{t("profRatingLabel")}</label>
              <div style={{ fontSize: '2rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <i
                    key={s}
                    className={`${s <= rating ? 'fas' : 'far'} fa-star`}
                    style={{ color: s <= rating ? '#fbbf24' : 'rgba(255,255,255,0.3)' }}
                    onClick={() => setRating(s)}
                  ></i>
                ))}
              </div>
            </div>
            <textarea
              className="form-control border-0 mb-4"
              rows="3"
              placeholder={t("profTellUsExperience")}
              style={{ borderRadius: '12px', padding: '15px' }}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
            <div className="d-flex gap-3 justify-content-end">
              <button type="button" className="btn btn-link text-white text-decoration-none" onClick={() => setShowForm(false)}>{t("profCancel")}</button>
              <button
                type="submit"
                className="btn btn-light px-4 py-2"
                style={{ borderRadius: '10px', fontWeight: 'bold', color: '#4f46e5' }}
                disabled={submitting}
              >
                {submitting ? t("profSending") : t("profSubmitFeedback")}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="feedback-analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="details-card" style={{ padding: '24px' }}>
          <h4 style={{ marginBottom: '15px', color: '#1e293b' }}>Booking Experience</h4>
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bookingExpData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {bookingExpData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="details-card" style={{ padding: '24px' }}>
          <h4 style={{ marginBottom: '15px', color: '#1e293b' }}>Ease of Use</h4>
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={easeOfUseData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis hide />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};


const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [wishlistHotels, setWishlistHotels] = useState([]);
  const [activeTab, setActiveTab] = useState(location.state?.tab || "profile");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Social States
  const [allUsers, setAllUsers] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [socialLoading, setSocialLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    /* ================= LOAD WISHLIST ================= */
    const wishlistIds = JSON.parse(localStorage.getItem("wishlist")) || [];
    const allHotels = JSON.parse(localStorage.getItem("hotels")) || [];

    const matchedHotels = allHotels.filter((h) =>
      wishlistIds.includes(h._id)
    );
    setWishlistHotels(matchedHotels);

    /* ================= LOAD BOOKINGS ================= */
    if (token) {
      fetch("http://localhost:5000/api/hotel-bookings/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setBookings(data.data || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  /* ================= UPLOAD PROFILE PHOTO ================= */
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch("http://localhost:5000/api/users/upload-photo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const updatedUser = { ...user, photo: data.user.photo };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("userUpdate")); // 🚀 Sync with Navbar
      } else {
        alert(data.message || "Failed to upload photo");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /* ================= REMOVE FROM WISHLIST ================= */
  const removeFromWishlist = (hotelId) => {
    const wishlistIds = JSON.parse(localStorage.getItem("wishlist")) || [];
    const updatedIds = wishlistIds.filter((id) => id !== hotelId);
    localStorage.setItem("wishlist", JSON.stringify(updatedIds));
    setWishlistHotels((prev) =>
      prev.filter((hotel) => hotel._id !== hotelId)
    );
  };

  /* ================= SOCIAL LOGIC ================= */
  const fetchAllUsers = async () => {
    try {
      setSocialLoading(true);
      const res = await fetch("http://localhost:5000/api/users/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      // Ensure we always have an array even if the API throws an error object
      setAllUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAllUsers([]);
    } finally {
      setSocialLoading(false);
    }
  };

  const handleFollow = async (followId) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ followId })
      });
      if (res.ok) {
        fetchAllUsers();
        refreshProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfollow = async (unfollowId) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/unfollow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ unfollowId })
      });
      if (res.ok) {
        fetchAllUsers();
        refreshProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptRequest = async (requesterId) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/accept-follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ requesterId })
      });
      if (res.ok) {
        fetchAllUsers();
        refreshProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineRequest = async (requesterId) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/decline-follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ requesterId })
      });
      if (res.ok) {
        fetchAllUsers();
        refreshProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const refreshProfile = async () => {
    const res = await fetch("http://localhost:5000/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  useEffect(() => {
    // Fetch users for suggestions/social tabs or for the main profile widget
    if (token) {
      fetchAllUsers();
    }
  }, [token, activeTab]);

  if (loading) return (
    <div className="empty-state">
      <i className="fas fa-spinner fa-spin"></i>
      <h3>Loading Profile</h3>
      <p>Please wait while we fetch your information...</p>
    </div>
  );

  if (!user) return (
    <div className="empty-state">
      <i className="fas fa-user-lock"></i>
      <h3>Please Login</h3>
      <p>You need to be logged in to view your profile dashboard.</p>
      <button className="btn-edit-profile" onClick={() => navigate("/login")}>Go to Login</button>
    </div>
  );

  return (
    <div className="profile-container">
      {/* 🔹 SIDEBAR NAVIGATION */}
      <aside className="profile-sidebar">
        <div className="sidebar-nav-card">
          <div className="sidebar-title">Menu</div>
          <nav className="sidebar-menu">
            <button
              className={`sidebar-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <i className="fas fa-user-circle"></i>
              {t("profMyProfile")}
            </button>
            <button
              className={`sidebar-item ${activeTab === "wishlist" ? "active" : ""}`}
              onClick={() => setActiveTab("wishlist")}
            >
              <i className="fas fa-heart"></i>
              {t("profWishlist")}
              {wishlistHotels.length > 0 && <span className="sidebar-badge">{wishlistHotels.length}</span>}
            </button>
            <button
              className={`sidebar-item ${activeTab === "bookings" ? "active" : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              <i className="fas fa-calendar-alt"></i>
              {t("profMyBookings")}
              {bookings.length > 0 && <span className="sidebar-badge">{bookings.length}</span>}
            </button>
            <button
              className={`sidebar-item ${activeTab === "messages" ? "active" : ""}`}
              onClick={() => setActiveTab("messages")}
            >
              <i className="fas fa-comments"></i>
              {t("profMessages")}
            </button>
            <button
              className={`sidebar-item ${activeTab === "suggestions" ? "active" : ""}`}
              onClick={() => setActiveTab("suggestions")}
            >
              <i className="fas fa-user-plus"></i>
              {t("profSuggestions")}
            </button>
            <button
              className={`sidebar-item ${activeTab === "requests" ? "active" : ""}`}
              onClick={() => setActiveTab("requests")}
            >
              <i className="fas fa-user-clock"></i>
              {t("profRequests")}
              {user.followRequests?.length > 0 && <span className="sidebar-badge bg-danger">{user.followRequests.length}</span>}
            </button>
            <button
              className={`sidebar-item ${activeTab === "feedback" ? "active" : ""}`}
              onClick={() => setActiveTab("feedback")}
            >
              <i className="fas fa-star-half-alt"></i>
              {t("profFeedback")}
            </button>

            {/* 🛠️ Link to Admin Dashboard */}
            {user?.isAdmin && (
              <Link to="/admin" className="sidebar-item" style={{ textDecoration: 'none' }}>
                <i className="fas fa-user-shield me-1"></i>
                {t("profAdminDashboard")}
              </Link>
            )}

            <div className="sidebar-separator" style={{ margin: '12px 0', borderTop: '1px solid var(--profile-border)' }}></div>

            <button className="sidebar-item logout-item" onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}>
              <i className="fas fa-sign-out-alt"></i>
              {t("profLogout")}
            </button>
          </nav>
        </div>
      </aside>

      {/* 🔹 MAIN CONTENT DASHBOARD */}
      <main className="profile-main-content">

        {/* HEADER AREA - Only show on Profile Tab */}
        {activeTab === "profile" && (
          <div className="profile-header-card animate-fade-in">
            <div className="profile-cover-banner"></div>
            <div className="profile-header-info">
              <div className="profile-squircle-avatar">
                <img
                  src={
                    user.photo
                      ? `http://localhost:5000/profile_photos/${user.photo}`
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Profile"
                />
                <div
                  className="avatar-upload-trigger"
                  onClick={() => fileInputRef.current?.click()}
                  title="Change Photo"
                >
                  {uploading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-camera"></i>}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>

              <div className="header-meta">
                <h1>{user.name}</h1>
                <p><i className="fas fa-envelope"></i> {user.email}</p>
                <div className="social-stats-container">
                  <div className="social-stat-item" onClick={() => setActiveTab('followers')}>
                    <span className="stat-value">{user.followers?.length || 0}</span>
                    <span className="stat-label">{t("profFollowers")}</span>
                  </div>
                  <div className="social-stat-item" onClick={() => setActiveTab('following')}>
                    <span className="stat-value">{user.following?.length || 0}</span>
                    <span className="stat-label">{t("profFollowing")}</span>
                  </div>
                </div>
              </div>

              <div className="header-actions">
                <button className="btn-edit-profile" onClick={() => navigate("/EditProfile")}>
                  <i className="fas fa-user-edit"></i> {t("profEditProfile")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT */}
        <div className="tab-container">

          {/* 👤 PROFILE DETAILS TAB */}
          {activeTab === "profile" && (
            <div className="details-card animate-fade-in">
              <div className="section-title">
                <i className="fas fa-id-card"></i>
                Personal Information
              </div>

              <div className="details-grid">
                <div className="detail-row">
                  <div className="detail-label">Full Name</div>
                  <div className="detail-value">{user.name}</div>
                  <div className="detail-action"><i className="fas fa-chevron-right"></i></div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">Email Address</div>
                  <div className="detail-value">{user.email}</div>
                  <div className="detail-action"><i className="fas fa-chevron-right"></i></div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">Phone Number</div>
                  <div className="detail-value">{user.phone || "Not provided"}</div>
                  <div className="detail-action"><i className="fas fa-chevron-right"></i></div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">Total Bookings</div>
                  <div className="detail-value">{bookings.length} trips planned</div>
                  <div className="detail-action"><i className="fas fa-chevron-right"></i></div>
                </div>
              </div>

              {/* 🔍 QUICK SUGGESTIONS WIDGET ON MAIN PROFILE */}
              <div className="quick-suggestions-widget mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold m-0"><i className="fas fa-user-friends me-2 text-primary"></i>Suggested Explorers</h5>
                  <button className="btn btn-link btn-sm text-decoration-none fw-bold" onClick={() => setActiveTab('suggestions')}>View All</button>
                </div>
                <div className="row g-3">
                  {allUsers
                    .filter(u => !user.following?.some(f => (f._id || f) === u._id) && (u._id || u.id) !== (user._id || user.id))
                    .slice(0, 3)
                    .map(u => (
                      <div className="col-md-4" key={u._id}>
                        <div className="suggestion-mini-card animate-fade-in">
                          <img src={u.photo ? `http://localhost:5000/profile_photos/${u.photo}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={u.name} />
                          <div className="mini-card-info">
                            <div className="name">{u.name}</div>
                            <button className="btn-follow-mini" onClick={() => handleFollow(u._id)}>
                              <i className="fas fa-plus me-1"></i> Follow
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  {allUsers.filter(u => !user.following?.some(f => (f._id || f) === u._id) && (u._id || u.id) !== (user._id || user.id)).length === 0 && (
                    <div className="col-12 text-center py-4 bg-light rounded-4">
                      <p className="text-muted small m-0">No new explorers to suggest right now.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ❤️ WISHLIST TAB */}
          {activeTab === "wishlist" && (
            <div className="wishlist-section animate-fade-in">
              <div className="section-title">
                <i className="fas fa-heart" style={{ color: '#ef4444' }}></i>
                Your Favorites
              </div>

              {wishlistHotels.length === 0 ? (
                <div className="empty-state">
                  <i className="far fa-heart"></i>
                  <h3>Your Wishlist is Empty</h3>
                  <p>Save your favorite hotels and destinations to view them here.</p>
                  <button className="btn-edit-profile" onClick={() => navigate("/hotels")}>Browse Hotels</button>
                </div>
              ) : (
                <div className="content-grid">
                  {wishlistHotels.map((hotel) => (
                    <div className="premium-card" key={hotel._id}>
                      <div className="card-img-wrapper">
                        <img src={hotel.images?.[0]} alt={hotel.name} />
                        <span className="card-badge">📍 {hotel.location}</span>
                      </div>
                      <div className="card-content">
                        <h4 className="card-title">{hotel.name}</h4>
                        <div className="card-meta">
                          <span><i className="fas fa-star" style={{ color: '#fbbf24' }}></i> 4.5</span>
                          <span>•</span>
                          <span>{hotel.rooms?.length || 0} Rooms</span>
                        </div>
                        <div className="card-footer">
                          <div className="price-tag">₹{hotel.pricePerNight} <small>/ night</small></div>
                          <button
                            className="btn-remove-wish"
                            onClick={() => removeFromWishlist(hotel._id)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 📘 BOOKINGS TAB */}
          {/* 📘 BOOKINGS TAB */}
          {activeTab === "bookings" && (
            <div className="bookings-section animate-fade-in">
              <div className="section-title">
                <i className="fas fa-suitcase-rolling"></i>
                Recent Bookings
              </div>

              {bookings.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-calendar-times"></i>
                  <h3>No Bookings Found</h3>
                  <p>You haven't made any bookings yet. Ready for an adventure?</p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button className="btn-edit-profile" onClick={() => navigate("/FlightBooking")}>Book Flight</button>
                    <button className="btn-edit-profile" onClick={() => navigate("/HotelBooking")}>Book Hotel</button>
                  </div>
                </div>
              ) : (
                <div className="booking-list">
                  {bookings.map((b) => (
                    <div className="booking-item-premium" key={b._id}>
                      <div className="booking-main">
                        <h4>{b.hotel?.name || "Premium Stay"}</h4>
                        <p><i className="fas fa-map-marker-alt"></i> {b.hotel?.location || "Location unkown"}</p>
                      </div>
                      <div className="booking-info-group">
                        <span className="info-label">Check-in</span>
                        <span className="info-value">{b.travelDate}</span>
                      </div>
                      <div className="booking-info-group">
                        <span className="info-label">Guests | Rooms</span>
                        <span className="info-value">
                          {b.seats?.length} {b.seats?.length > 1 ? 'Rooms' : 'Room'}
                        </span>
                      </div>
                      <div className="booking-status">
                        <span className={`status-pill status-${b.status?.toLowerCase() || 'pending'}`}>
                          {b.status || 'Pending'}
                        </span>
                      </div>
                      <div className="booking-total">
                        <div className="price-tag">₹{b.totalAmount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 💬 MESSAGES / SUPPORT TAB */}
          {activeTab === "messages" && (
            <MessagesTab
              token={token}
              user={user}
              navigate={navigate}
            />
          )}

          {/* ⭐ FEEDBACK TAB */}
          {activeTab === "feedback" && (
            <FeedbackTab token={token} />
          )}

          {/* 🔍 SUGGESTIONS TAB */}
          {activeTab === "suggestions" && (
            <div className="suggestions-section animate-fade-in">
              <div className="section-title">
                <i className="fas fa-user-plus"></i>
                People you may know
              </div>
              {socialLoading ? (
                <div className="text-center p-5"><i className="fas fa-spinner fa-spin fs-1"></i></div>
              ) : (
                <div className="suggestions-grid">
                  {allUsers
                    .filter(u => !user.following?.some(f => (f._id || f) === u._id))
                    .map(u => {
                      const isRequested = u.followRequests?.includes(user._id || user.id);

                      return (
                        <div className="user-suggest-card" key={u._id}>
                          <Link to={`/user/${u._id}`} className="text-decoration-none">
                            <img
                              src={u.photo ? `http://localhost:5000/profile_photos/${u.photo}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                              className="suggest-avatar"
                              alt={u.name}
                            />
                            <div className="suggest-name">{u.name}</div>
                          </Link>
                          <div className="suggest-email text-muted small mb-3">{u.email}</div>

                          {isRequested ? (
                            <button className="btn btn-outline-secondary w-100 rounded-pill fw-bold" disabled>Requested</button>
                          ) : (
                            <button className="btn-follow follow w-100" onClick={() => handleFollow(u._id)}>Follow</button>
                          )}
                        </div>
                      );
                    })}
                  {allUsers.filter(u => !user.following?.some(f => (f._id || f) === u._id)).length === 0 && (
                    <div className="text-center w-100 py-5">
                      <i className="fas fa-check-circle text-success fs-1 mb-3"></i>
                      <p className="text-muted">You are following everyone suggested! Check back later for more explorers.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 📩 REQUESTS TAB */}
          {activeTab === "requests" && (
            <div className="requests-section animate-fade-in">
              <div className="section-title">
                <i className="fas fa-user-clock"></i>
                Follow Requests
              </div>
              <div className="user-list">
                {user.followRequests?.map(u => (
                  <div className="user-list-item d-flex align-items-center justify-content-between p-3 bg-white rounded-4 shadow-sm mb-3 border" key={u._id}>
                    <Link to={`/user/${u._id}`} className="d-flex align-items-center gap-3 text-decoration-none text-dark">
                      <img src={u.photo ? `http://localhost:5000/profile_photos/${u.photo}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="user-list-avatar" alt={u.name} />
                      <div>
                        <div className="fw-bold">{u.name}</div>
                        <div className="text-muted small">{u.email}</div>
                      </div>
                    </Link>
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary btn-sm rounded-pill px-4 fw-bold" onClick={() => handleAcceptRequest(u._id)}>Accept</button>
                      <button className="btn btn-outline-danger btn-sm rounded-pill px-4 fw-bold" onClick={() => handleDeclineRequest(u._id)}>Decline</button>
                    </div>
                  </div>
                ))}
                {(!user.followRequests || user.followRequests.length === 0) && (
                  <div className="text-center py-5">
                    <i className="fas fa-ghost fs-1 text-muted mb-3"></i>
                    <p className="text-muted">No pending follow requests.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 👥 FOLLOWERS TAB */}
          {activeTab === "followers" && (
            <div className="followers-section animate-fade-in">
              <div className="section-title">
                <i className="fas fa-users"></i>
                Your Followers
              </div>
              <div className="user-list">
                {user.followers?.map(u => (
                  <div className="user-list-item d-flex align-items-center justify-content-between p-3 bg-white rounded-4 shadow-sm mb-3 border" key={u._id}>
                    <Link to={`/user/${u._id}`} className="d-flex align-items-center gap-3 text-decoration-none text-dark flex-grow-1">
                      <img src={u.photo ? `http://localhost:5000/profile_photos/${u.photo}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="user-list-avatar" alt={u.name} />
                      <div className="flex-grow-1">
                        <div className="fw-bold">{u.name}</div>
                        <div className="text-muted small">{u.email}</div>
                      </div>
                    </Link>
                    {user.following?.some(f => (f._id || f) === u._id) ? (
                      <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => handleUnfollow(u._id)}>Following</button>
                    ) : (
                      <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => handleFollow(u._id)}>Follow Back</button>
                    )}
                  </div>
                ))}
                {(!user.followers || user.followers.length === 0) && <p className="text-muted text-center py-5">You don't have any followers yet.</p>}
              </div>
            </div>
          )}

          {/* 🏃 FOLLOWING TAB */}
          {activeTab === "following" && (
            <div className="following-section animate-fade-in">
              <div className="section-title">
                <i className="fas fa-user-check"></i>
                Following
              </div>
              <div className="user-list">
                {user.following?.map(u => (
                  <div className="user-list-item d-flex align-items-center justify-content-between p-3 bg-white rounded-4 shadow-sm mb-3 border" key={u._id}>
                    <Link to={`/user/${u._id}`} className="d-flex align-items-center gap-3 text-decoration-none text-dark flex-grow-1">
                      <img src={u.photo ? `http://localhost:5000/profile_photos/${u.photo}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="user-list-avatar" alt={u.name} />
                      <div className="flex-grow-1">
                        <div className="fw-bold">{u.name}</div>
                        <div className="text-muted small">{u.email}</div>
                      </div>
                    </Link>
                    <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => handleUnfollow(u._id)}>Unfollow</button>
                  </div>
                ))}
                {(!user.following || user.following.length === 0) && <p className="text-muted text-center py-5">You are not following anyone yet.</p>}
              </div>
            </div>
          )}

          {/* 📊 ADMIN STATS TAB */}
          {activeTab === "admin-stats" && user.isAdmin && (
            <AdminStatsTab token={token} navigate={navigate} />
          )}
        </div>

      </main>
    </div>
  );
};

export default Profile;
