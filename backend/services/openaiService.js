import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getChatResponse = async (messages) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are TravelSphere AI Assistant, a helpful and knowledgeable travel expert. You help users find hotels, plan trips, suggest destinations, and answer travel-related questions. You should respond naturally and provide useful information. If a user asks for specific types of hotels (e.g., budget, luxury, with pool), mention that they can use the filters on the Hotels page for better results. Keep your responses concise but friendly.',
        },
        ...messages,
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};
