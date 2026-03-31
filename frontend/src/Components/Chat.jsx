import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const chatEndRef = useRef(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async () => {
        if (!token) return;
        try {
            const res = await fetch("http://localhost:5000/api/messages/user-messages", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                // We need to flatten the structure if needed, 
                // but currently the backend returns messages sent by user.
                // We need to show both user content and admin reply in the chat flow.
                const formattedMessages = [];
                data.data.forEach(msg => {
                    // User's message
                    formattedMessages.push({
                        id: msg._id + '_user',
                        text: msg.content,
                        sender: 'user',
                        timestamp: msg.createdAt
                    });
                    // Admin's reply if exists
                    if (msg.reply) {
                        formattedMessages.push({
                            id: msg._id + '_admin',
                            text: msg.reply,
                            sender: 'admin',
                            timestamp: msg.repliedAt || msg.updatedAt
                        });
                    }
                });
                // Sort by timestamp
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
        if (!token) {
            navigate('/login');
            return;
        }
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Polling every 5s
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
                setNewMessage('');
                fetchMessages();
            }
        } catch (error) {
            console.error("Send message error:", error);
        }
    };

    if (loading) return <div className="chat-loading"><i className="fas fa-circle-notch fa-spin"></i> Loading Chat...</div>;

    return (
        <div className="chat-wrapper">
            <div className="chat-container">
                {/* Chat Header */}
                <div className="chat-header">
                    <div className="chat-header-info">
                        <div className="admin-avatar">
                            <i className="fas fa-headset"></i>
                        </div>
                        <div>
                            <h5>Admin Support</h5>
                            <span className="online-status">Online</span>
                        </div>
                    </div>
                    <button className="close-chat" onClick={() => navigate(-1)}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Chat Messages */}
                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <div className="no-messages">
                            <p>👋 Hello! How can we help you today?</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.id} className={`message-bubble ${msg.sender === 'user' ? 'user' : 'admin'}`}>
                                <div className="message-content">
                                    {msg.text}
                                    <span className="message-time">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {msg.sender === 'user' && <i className="fas fa-check-double ms-1 text-primary"></i>}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <form className="chat-input-area" onSubmit={handleSendMessage}>
                    <button type="button" className="attachment-btn">
                        <i className="fas fa-plus"></i>
                    </button>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
