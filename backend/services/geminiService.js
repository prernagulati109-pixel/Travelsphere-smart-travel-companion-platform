import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Initialize dotenv
dotenv.config();

/**
 * TravelSphere Gemini AI Service
 * This service handles all interactions with Google Gemini 1.5 Flash.
 */

// Safe initialization of the API Key
const getApiKey = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn("⚠️ WARNING: GEMINI_API_KEY is not defined in .env file");
  }
  return key || "";
};

// Initialize the Google Generative AI with the API Key
// Note: We use a getter or check inside to prevent startup crashes if key is missing
let genAI;
try {
  const apiKey = getApiKey();
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log("✅ Gemini AI initialized successfully");
  }
} catch (err) {
  console.error("❌ Failed to initialize Gemini AI:", err.message);
}

const SYSTEM_INSTRUCTION = `
You are TravelSphere AI Assistant, a high-end travel expert and virtual guide for the TravelSphere platform.

TravelSphere is a modern travel planning app that helps users explore 14 global destinations:
Paris, Kyoto, Maldives, New York, Tokyo, Bali, Rome, Santorini,
Dubai, London, Sydney, Bangkok, Istanbul, and Barcelona.

Your goals:
1. Help users plan trips and suggest destinations based on their interests.
2. Recommend hotels from our collection.
3. Guide users to use TravelSphere features.
4. Mention filters on the Hotels page for accurate results.
5. Provide travel tips and local insights.

Respond in a friendly, professional, and helpful tone.
Keep responses concise but information-rich.
Use emojis naturally to stay engaging.
`;

/**
 * Generates a chat response using Gemini 1.5 Flash
 * @param {Array} messages - Array of message objects { role: 'user' | 'assistant', content: string }
 * @returns {Promise<string>} - The AI generated response
 */
export const getChatResponse = async (messages) => {
  try {
    console.log("--- Chatbot Request Started ---");
    
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please check your .env file.");
    }

    if (!genAI) {
      genAI = new GoogleGenerativeAI(apiKey);
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION
    });

    // Format the messages for Gemini's multi-turn content format
    // Roles must be 'user' or 'model' (Gemini uses 'model' instead of 'assistant')
    const contents = messages.map(msg => ({
      role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    console.log(`Processing ${contents.length} messages...`);
    
    // Use generateContent as requested
    const result = await model.generateContent({
      contents: contents,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const response = result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    console.log("✅ Chatbot response generated successfully.");
    return text;

  } catch (error) {
    // Log detailed error for debugging in terminal
    console.error("❌ GEMINI SERVICE ERROR TYPE:", error.constructor.name);
    console.error("❌ GEMINI SERVICE ERROR MESSAGE:", error.message);
    
    if (error.response) {
      console.error("❌ GEMINI API RESPONSE ERROR:", JSON.stringify(error.response, null, 2));
    }

    if (error.stack) {
      console.error("❌ ERROR STACK:", error.stack);
    }

    // Safe fallback response to ensure backend never crashes and user gets a response
    // The user wants to see this only if the request actually fails.
    return "I'm currently exploring some new travel routes! ✈️ I'll be back online in a moment. In the meantime, feel free to browse our amazing destinations or use the filters to find your perfect hotel.";
  }

};