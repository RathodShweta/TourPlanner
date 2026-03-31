import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../App.css";
import "./TourBot.css";

const TourBot = () => {
    const { t } = useTranslation();
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState([
        { from: "bot", text: t("botGreeting") }
    ]);
    const chatEndRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat, isLoading]);

    /* 🎤 VOICE INPUT */
    const startVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice input is not supported in this browser.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.start();
        recognition.onresult = (event) => {
            setMessage(event.results[0][0].transcript);
        };
    };

    const sendMessage = async (userMsg = message) => {
        if (!userMsg.trim() || isLoading) return;

        const currentChat = [...chat];
        // Add user message to chat
        const newChat = [...currentChat, { from: "user", text: userMsg }];
        setChat(newChat);
        setMessage("");
        setIsLoading(true);

        try {
            // Exclude initial greeting (index 0) from history to ensure it starts with a 'user' msg
            const historyForAI = currentChat.length > 1 ? currentChat.slice(1) : [];

            // Call backend API
            const response = await axios.post("http://localhost:5000/api/tourbot/chat", {
                message: userMsg,
                history: historyForAI.slice(-10) 
            });

            setChat([...newChat, { from: "bot", text: response.data.reply }]);
        } catch (error) {
            console.error("TourBot Error:", error);
            setChat([...newChat, { 
                from: "bot", 
                text: "⚠️ My AI brain is a bit fuzzy right now! Please try again or check out our /FAQ." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedQuestions = [
        t("botSuggestJaipur"),
        t("botSuggestTaj"),
        t("botSuggestGoa"),
        t("botSuggestFlight"),
        t("botSuggestManali"),
        t("botSuggestKerala")
    ];

    // Basic markdown helper (simple bold and bullets)
    const formatBotReply = (text) => {
        if (!text) return "";
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\* (.*?)\n/g, '<li>$1</li>') // Bullets
            .split('\n').map((line, i) => <p key={i} dangerouslySetInnerHTML={{ __html: line }} />);
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.2rem' }}>🤖</div>
                    <div>
                        <h2 style={{ fontSize: '1.1rem' }}>TourBot AI</h2>
                        <p style={{ fontSize: '0.7rem', margin: 0, opacity: 0.8 }}>Online • Your Travel Companion</p>
                    </div>
                </div>
                <button 
                  onClick={() => setChat([{ from: "bot", text: t("botHistoryCleared") }])}
                  style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '100px', cursor: 'pointer', fontSize: '0.7rem', transition: 'all 0.3s' }}
                >
                    {t("botReset")}
                </button>
            </div>

            <div className="chat-box">
                {chat.map((c, index) => (
                    <div key={index} className={c.from === "bot" ? "bot-msg" : "user-msg"}>
                        {c.from === "bot" ? formatBotReply(c.text) : c.text}
                    </div>
                ))}
                {isLoading && (
                    <div className="bot-msg">
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="suggested-qs">
                {suggestedQuestions.map((q, i) => (
                    <button key={i} className="suggested-btn" onClick={() => sendMessage(q)}>
                        {q}
                    </button>
                ))}
            </div>

            <div className="chat-input-wrapper">
                <div className="chat-input">
                    <input
                        type="text"
                        placeholder={t("botPlaceholder")}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        disabled={isLoading}
                    />
                    <button className="mic-btn" onClick={startVoiceInput} title="Voice Command">🎤</button>
                    <button 
                        className="send-btn" 
                        onClick={() => sendMessage()} 
                        disabled={!message.trim() || isLoading}
                    >
                        {isLoading ? "..." : t("send")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TourBot;


