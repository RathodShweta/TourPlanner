const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: "d:/React/TourPlanner/backend/.env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say 'AI is working' if this works!");
        const response = await result.response;
        console.log("Gemini Output:", response.text());
    } catch (error) {
        console.error("Gemini Error:", error.message);
    }
}

testGemini();
