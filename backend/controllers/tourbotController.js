const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Enhanced TourBot Controller using Google Gemini AI.
 * Handles conversational context and provides dynamic travel advice.
 */
const handleChat = async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        // System Prompt to define the "TourBot" persona
        const systemPrompt = `You are "TourBot", a premium, helpful, and enthusiastic travel assistant for the "TourPlanner" app. 
        Your goal is to help users plan trips, find hotels, flights, and suggest destinations in India and internationally.
        
        Guidelines:
        1. Keep responses concise but informative.
        2. Use Markdown formatting (bold, bullet points) to make itineraries and suggestions easy to read.
        3. Be proactive: if a user asks for a destination, suggest a budget or a quick 3-4 day itinerary.
        4. When suggesting hotels, emphasize comfort and value.
        5. If asked about booking, guide them to the relevant sections of the "TourPlanner" app (Login, Signup, Flights, Hotels).
        6. Use a friendly, professional tone with occasional travel-related emojis.
        7. DO NOT repeat yourself. Provide fresh, unique advice for every query.
        8. If you don't know something specific, offer to help search for it or suggest a related alternative.
        9. ALWAYS format your response in a way that looks great in a chat bubble.
        
        Current context: The user is browsing the TourPlanner website.`;

        // Prepare the chat with history if provided
        const prepareChat = (modelName) => {
            const tempModel = genAI.getGenerativeModel({ model: modelName });
            return tempModel.startChat({
                history: history ? history.map(msg => ({
                    role: msg.from === "bot" ? "model" : "user",
                    parts: [{ text: msg.text }],
                })) : [],
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });
        };

        // Try different models if one fails
        // Try different models if one fails
        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
        let lastError = null;
        let reply = null;

        for (const modelName of modelsToTry) {
            try {
                const chat = prepareChat(modelName);
                const finalPrompt = history && history.length > 0 ? message : `${systemPrompt}\n\nUser: ${message}`;
                const result = await chat.sendMessage(finalPrompt);
                const response = await result.response;
                reply = response.text();
                if (reply) break;
            } catch (err) {
                lastError = err;
                if (!err.message.toLowerCase().includes("not found") && !err.message.toLowerCase().includes("not supported")) {
                    break; // stop if it's a real error like invalid key
                }
            }
        }

        // --- RULE-BASED FALLBACK (If AI fails) ---
        if (!reply) {
            console.warn("TourBot: AI failed, using rule-based fallback.");
            const msg = message.toLowerCase();
            if (msg.includes("goa")) {
                reply = "Goa is amazing! 🌴 For a 4-day trip, I recommend North Goa for vibrant beaches like Baga and South Goa for a peaceful stay in Palolem. Budget around ₹20,000.";
            } else if (msg.includes("manali")) {
                reply = "Manali is a perfect mountain getaway! 🏔️ Don't miss Solang Valley and Old Manali's cafes. Best visited between October and June.";
            } else if (msg.includes("hotel") || msg.includes("stay")) {
                reply = "I can help with hotels! We have great options in Mumbai, Delhi, and Goa. You can check the 'Hotels' section in the app for the best deals.";
            } else if (msg.includes("flight") || msg.includes("cheap")) {
                reply = "Looking for cheap flights? ✈️ I recommend booking at least 3 weeks in advance. Check our 'Flights' section for real-time prices!";
            } else {
                reply = "I'm currently in 'offline mode' as I'm having trouble connecting to my AI brain. But I can still help! Are you interested in Goa, Manali, or booking a hotel?";
            }

            // Still report the AI error in the console but provide a working response
            return res.json({
                reply: `⚠️ (Offline Mode) ${reply}`,
                isFallback: true,
                error: lastError ? lastError.message : "AI model connectivity issue"
            });
        }

        res.json({
            reply,
            nextStep: "start"
        });

    } catch (error) {
        console.error("Gemini AI Error:", error);

        // More robust error capturing
        const errorMessage = error.message ? error.message.toLowerCase() : "";
        let errorType = "API_ERROR";
        let errorMsg = "🤖 I'm having a little trouble connecting to my travel database.";

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
            errorType = "MISSING_KEY";
            errorMsg += " It seems my API key is missing. Please check the backend .env file.";
        } else if (errorMessage.includes("api_key_invalid") || errorMessage.includes("unauthorized")) {
            errorType = "INVALID_KEY";
            errorMsg += " It seems my API key is invalid. Please ensure you have a valid Google Gemini API key.";
        } else if (errorMessage.includes("not found") || errorMessage.includes("not supported")) {
            errorType = "MODEL_NOT_FOUND";
            errorMsg += " I couldn't find the AI model. The current API key might not have access to 'gemini-1.5-flash'.";
        } else {
            errorMsg += " Please try again in a moment! (Error: " + (error.message || "Unknown") + ")";
        }

        // Log to file for deeper inspection if needed
        const fs = require('fs');
        const logMsg = `[${new Date().toISOString()}] ${errorType}: ${error.message}\n`;
        fs.appendFileSync('backend_error_log.txt', logMsg);

        res.status(500).json({
            reply: errorMsg,
            errorType: errorType,
            error: error.message
        });
    }
};

module.exports = { handleChat };
