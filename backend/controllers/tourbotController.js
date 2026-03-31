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
        const systemPrompt = `You are "TourBot", an advanced AI travel companion for the "TourPlanner" platform, similar in personality and versatility to "Meta AI" or "Snapchat My AI". 

        YOUR PERSONALITY:
        - You are a world-class travel expert, historian, and friendly local guide all in one.
        - You are enthusiastic, witty, and deeply knowledgeable about global cultures, history, and geography.
        - You don't just provide facts; you tell stories and provide "insider" tips.

        YOUR CAPABILITIES:
        1. GENERAL KNOWLEDGE: Answer ANY question about travel, geography, history, or culture. If a user asks about the history of the Taj Mahal or the best time to visit Tokyo, provide rich, detailed answers.
        2. SMART SUGGESTIONS: Suggest the best hotels, hidden restaurants, and "must-see" spots based on the user's vibe (e.g., luxury, backpacker, foodie).
        3. WEBSITE INTEGRATION: While you are a general AI, you are also the heart of TourPlanner. Always link your advice back to our tools:
           - Destinations: /Destinations
           - Flights: /Flights
           - Hotels: /Hotels
           - Help: /FAQ
        4. HISTORY & DRILL-DOWN: When a user mentions a place, feel free to give a 1-2 sentence "fun fact" or historical snippet to make the conversation engaging.

        GUIDELINES:
        - Use Markdown for beautiful formatting (bold, lists, headers).
        - Use emojis to keep it lively (🏔️, 🏛️, 🍜, ✈️).
        - If a user asks for something completely unrelated to travel (like math or coding), politely answer but steer the conversation back to their next potential adventure.
        - For itineraries, be specific and organized.
        
        Example: If they ask "What's the history of Goa?", don't just say "It's a state." Talk about the Portuguese influence, the churches, and how they can book a heritage tour on our /Destinations page.`;

        // Prepare the chat with history if provided
        const prepareChat = (modelName) => {
            const tempModel = genAI.getGenerativeModel({ 
                model: modelName,
                systemInstruction: systemPrompt,
            });

            // Gemini background history MUST start with the 'user' role.
            // Let's filter/slice the history to ensure this.
            let validHistory = [];
            if (history && history.length > 0) {
                validHistory = history
                    .map(msg => ({
                        role: msg.from === "bot" ? "model" : "user",
                        parts: [{ text: msg.text }],
                    }));
                
                // If it starts with model, remove it
                while (validHistory.length > 0 && validHistory[0].role === "model") {
                    validHistory.shift();
                }
            }

            return tempModel.startChat({
                history: validHistory,
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });
        };

        // Try different models if one fails
        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
        let lastError = null;
        let reply = null;

        for (const modelName of modelsToTry) {
            try {
                const chat = prepareChat(modelName);
                const result = await chat.sendMessage(message);
                const response = await result.response;
                reply = response.text();
                if (reply) break;
            } catch (err) {
                lastError = err;
                console.error(`Error with model ${modelName}:`, err.message);
                if (err.message.toLowerCase().includes("not found") || err.message.toLowerCase().includes("not supported")) {
                    continue; 
                }
                break;
            }
        }

        // --- RULE-BASED FALLBACK (If AI fails) ---
        if (!reply) {
            const msg = message.toLowerCase();
            if (msg.includes("goa")) {
                reply = "Goa is a coastal paradise with beautiful beaches like Calangute and Baga. You can explore the Portuguese heritage in Old Goa or enjoy the vibrant nightlife!";
            } else if (msg.includes("manali")) {
                reply = "Manali is a stunning mountain station. I recommend visiting Solang Valley for adventure sports and visiting the Hadimba Temple for its history.";
            } else if (msg.includes("hotel") || msg.includes("stay")) {
                reply = "Searching for the perfect stay? Check out our '/Hotels' section for curated luxury and budget options across India.";
            } else if (msg.includes("flight") || msg.includes("cheap")) {
                reply = "I can help you find flights! Head over to '/Flights' to compare prices and book your next journey.";
            } else if (msg.includes("history") || msg.includes("fact")) {
                reply = "Every destination has a story! For example, did you know that Jaipur is known as the Pink City because it was painted pink to welcome Prince Albert in 1876?";
            } else {
                reply = "I'm having a hard time finding a specific answer for that right now. Could you please tell me more about where you want to go or what you want to do?";
            }

            return res.json({
                reply: `${reply}`,
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
