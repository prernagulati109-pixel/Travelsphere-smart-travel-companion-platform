import { getChatResponse } from './services/geminiService.js';

const test = async () => {
  try {
    const messages = [
      { role: 'assistant', content: 'Hello 👋\nI’m TravelSphere AI Assistant.' },
      { role: 'user', content: 'Tell me about hotels in Paris' }
    ];
    const res = await getChatResponse(messages);
    console.log("Response:", res);
  } catch (err) {
    console.error("Test error:", err);
  }
};

test();
