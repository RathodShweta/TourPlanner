import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Profile.css";

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const [targetUser, setTargetUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:5000/api/users/profile/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
            setTargetUser(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/users/follow", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ followId: id })
            });
            if (res.ok) fetchProfile();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUnfollow = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/users/unfollow", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ unfollowId: id })
            });
            if (res.ok) fetchProfile();
        } catch (err) {
            console.error(err);
        }
    };

    const handleBlock = async () => {
        if (!window.confirm("Are you sure you want to block this user?")) return;
        try {
            const res = await fetch("http://localhost:5000/api/users/block", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ blockId: id })
            });
            if (res.ok) {
                alert("User blocked");
                navigate("/Profile");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="profile-container justify-content-center align-items-center">
            <div className="text-center p-5"><i className="fas fa-spinner fa-spin fs-1 text-primary"></i></div>
        </div>
    );

    if (error || !targetUser) return (
        <div className="profile-container justify-content-center">
            <div className="empty-state">
                <i className="fas fa-exclamation-triangle"></i>
                <h3>Error</h3>
                <p>{error || "User not found"}</p>
                <button className="btn-edit-profile" onClick={() => navigate("/Profile")}>Back to My Profile</button>
            </div>
        </div>
    );

    const isFollowing = targetUser.followers?.some(f => (f._id || f) === currentUser.id);
    const isRequested = targetUser.followRequests?.includes(currentUser.id);



    return (
        <div className="profile-container animate-fade-in">
            <div className="profile-main-content w-100">
                <div className="profile-header-card">
                    <div className="profile-cover-banner"></div>
                    <div className="profile-header-info">
                        <div className="profile-squircle-avatar">
                            <img
                                src={targetUser.photo ? `http://localhost:5000/profile_photos/${targetUser.photo}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                alt={targetUser.name}
                            />
                        </div>

                        <div className="header-meta">
                            <h1>{targetUser.name}</h1>
                            <p><i className="fas fa-envelope"></i> {targetUser.email}</p>

                            <div className="social-stats-container mt-3">
                                <div className="social-stat-item">
                                    <span className="stat-value">{targetUser.followers?.length || 0}</span>
                                    <span className="stat-label">Followers</span>
                                </div>
                                <div className="social-stat-item">
                                    <span className="stat-value">{targetUser.following?.length || 0}</span>
                                    <span className="stat-label">Following</span>
                                </div>
                            </div>
                        </div>

                        <div className="header-actions d-flex align-items-center gap-3">
                            {isFollowing ? (
                                <button className="btn-follow unfollow" style={{ width: 'auto', padding: '8px 24px' }} onClick={handleUnfollow}>Unfollow</button>
                            ) : isRequested ? (
                                <button className="btn-follow" style={{ width: 'auto', padding: '8px 24px', background: '#f1f5f9', color: '#64748b', borderColor: '#e2e8f0' }} disabled>Requested</button>
                            ) : (
                                <button className="btn-follow follow" style={{ width: 'auto', padding: '8px 24px' }} onClick={handleFollow}>Follow</button>
                            )}

                            <div className="position-relative">
                                <button
                                    className={`more-options-btn ${showMore ? 'active' : ''}`}
                                    onClick={() => setShowMore(!showMore)}
                                >
                                    <i className={`fas ${showMore ? 'fa-times' : 'fa-ellipsis-h'}`}></i>
                                </button>

                                {showMore && (
                                    <div className="options-horizontal-menu animate-slide-up">
                                        <button
                                            className="horizontal-action-item sms-btn"
                                            onClick={() => navigate("/Profile", { state: { tab: 'messages' } })}
                                        >
                                            <i className="fas fa-comment-dots"></i>
                                            <span>SMS</span>
                                        </button>
                                        <button
                                            className="horizontal-action-item block-btn"
                                            onClick={handleBlock}
                                        >
                                            <i className="fas fa-ban"></i>
                                            <span>Block</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Optional: User's Followers/Following Lists could be shown here as well */}
                <div className="details-card mt-4">
                    <h4 className="section-title"><i className="fas fa-info-circle"></i> About traveler</h4>
                    <div className="detail-row">
                        <span className="detail-label">Gender</span>
                        <span className="detail-value">{targetUser.gender || "Not specified"}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Account Type</span>
                        <span className="detail-value">Explorer</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
