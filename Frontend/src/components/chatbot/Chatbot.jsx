import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiRobot2Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';
import './chatbot.css';

const API_URL = 'http://localhost:5000/api/chatbot';

const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello 👋\nI’m TravelSphere AI Assistant.\nI can help you find hotels, plan trips, and suggest destinations.',
    },
  ]);

  const handleSendMessage = async (text) => {
    const userMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    // Simple keyword detection for triggering filters
    const lowerText = text.toLowerCase();
    if (lowerText.includes('pool')) {
      navigate('/hotels?amenity=Pool');
    } else if (lowerText.includes('budget')) {
      navigate('/hotels?maxPrice=5000');
    } else if (lowerText.includes('luxury')) {
      navigate('/hotels?minRating=5&maxPrice=150000');
    } else if (lowerText.includes('deals') || lowerText.includes('offer')) {
      navigate('/hotels?deals=true');
    } else if (lowerText.includes('hotels in')) {
      const match = lowerText.match(/hotels in ([a-z\s]+)/);
      if (match && match[1]) {
        navigate(`/hotels?search=${encodeURIComponent(match[1].trim())}`);
      }
    }

    try {
      console.log('Sending messages to backend:', newMessages);
      
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Response data from backend:', data);

      const reply = data.reply;
      console.log('AI Reply:', reply);

      if (reply) {
        const botMessage = { role: 'assistant', content: reply };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error('No reply in response data');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to the server. Please make sure the backend is running and your API key is valid.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    handleSendMessage(`Tell me about ${action}`);
  };

  return (
    <div className="chatbot-container">
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            onClose={() => setIsOpen(false)}
            isLoading={isLoading}
            onQuickAction={handleQuickAction}
          />
        )}
      </AnimatePresence>

      <motion.button
        className="chatbot-button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <RiRobot2Fill />
      </motion.button>
    </div>
  );
};

export default Chatbot;
