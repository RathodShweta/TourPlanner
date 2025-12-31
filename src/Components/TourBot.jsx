import React, { useState } from "react";
import "../App.css";

const TourBot = () => {
  const [message, setMessage] = useState("");
  const [step, setStep] = useState("start");

  const [chat, setChat] = useState([
    { from: "bot", text: "Hi 👋 I’m TourBot. How can I help you today?" }
  ]);

  /* 🎤 VOICE INPUT */
  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported. Please use Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      setMessage(event.results[0][0].transcript);
    };

    recognition.start();
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const userMsg = message;
    setChat(prev => [...prev, { from: "user", text: userMsg }]);
    setMessage("");

    setTimeout(() => {
      const botReply = getBotReply(userMsg);
      setChat(prev => [...prev, { from: "bot", text: botReply }]);
    }, 500);
  };

  /* 🧠 BOT LOGIC */
  const getBotReply = (msg) => {
    msg = msg.toLowerCase();

    /* TOUR PLANNING & SUGGESTIONS */
    if (
      msg.includes("tour") ||
      msg.includes("trip") ||
      msg.includes("plan") ||
      msg.includes("suggest")
    ) {
      return (
        "🧳 I can help you plan a perfect tour!\n" +
        "Please tell me:\n" +
        "1️⃣ Destination (or ask for suggestions)\n" +
        "2️⃣ Budget\n" +
        "3️⃣ Number of days\n" +
        "4️⃣ Travel date"
      );
    }

    if (msg.includes("budget")) {
      return (
        "💰 Budget tour ideas:\n" +
        "• ₹10,000 – Local trips (Mahabaleshwar, Lonavala)\n" +
        "• ₹15,000 – Goa, Jaipur\n" +
        "• ₹20,000+ – Manali, Kerala\n" +
        "Tell me your budget 😊"
      );
    }

    if (step === "start") {
      if (msg.includes("flight")) {
        setStep("flight_details");
        return "✈️ Tell me source, destination and travel date.";
      }

      if (msg.includes("hotel")) {
        setStep("hotel_details");
        return "🏨 Please tell me destination and budget.";
      }

      if (msg.includes("login")) {
        return "🔐 Go to Login → enter email & password → click Login.";
      }

      if (msg.includes("signup")) {
        return "📝 Go to Signup → fill details → submit.";
      }

      if (msg.includes("destination")) {
        return "🌍 Popular destinations: Goa, Manali, Jaipur, Kerala.";
      }

      if (msg.includes("hi") || msg.includes("hello")) {
        return "👋 Hello! How can I help you today?";
      }

      return "❓ I can help with tours, trip planning, hotels, flights & bookings.";
    }

    if (step === "flight_details") {
      setStep("start");
      return `✈️ Searching flights for: ${msg}`;
    }

    if (step === "hotel_details") {
      setStep("start");
      return `🏨 Searching hotels for: ${msg}`;
    }

    return "🤖 Sorry, I didn’t understand. Try asking about tours or trips.";
  };

  return (
    <div className="chatbot-container">
      <h2>🤖 TourBot – Travel Assistant</h2>

      <div className="chat-box">
        {chat.map((c, index) => (
          <div
            key={index}
            className={c.from === "bot" ? "bot-msg" : "user-msg"}
          >
            {c.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask about tours, trips, flights, hotels..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button className="mic-btn" onClick={startVoiceInput}>🎤</button>
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default TourBot;
