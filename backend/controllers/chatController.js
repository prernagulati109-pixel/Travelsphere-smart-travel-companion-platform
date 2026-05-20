import * as geminiService from '../services/geminiService.js';
import Chat from '../models/Chat.js';

/**
 * Handles chat requests from the frontend
 * Expected body: { messages: [ { role: 'user', content: '...' }, ... ] }
 */
export const handleChat = async (req, res) => {
  try {
    console.log("Incoming request to /api/chatbot/chat");
    
    let chatMessages = req.body.messages;

    if (!chatMessages && req.body.message) {
      chatMessages = [...(req.body.history || []), { role: 'user', content: req.body.message }];
    }

    if (!chatMessages || !Array.isArray(chatMessages) || chatMessages.length === 0) {
      return res.status(400).json({ 
        error: 'Messages array is required' 
      });
    }

    const aiResponse = await geminiService.getChatResponse(chatMessages);

    // Save chat to database
    try {
      const fullHistory = [...chatMessages, { role: 'assistant', content: aiResponse }];
      const newChat = new Chat({
        messages: fullHistory,
        userId: req.body.userId || 'anonymous'
      });
      await newChat.save();
      console.log("✅ Chat history saved to MongoDB");
    } catch (saveError) {
      console.error("⚠️ Failed to save chat history:", saveError.message);
      // Don't fail the request if saving history fails
    }

    res.json({ reply: aiResponse });

  } catch (error) {
    console.error('❌ Chat controller error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};
