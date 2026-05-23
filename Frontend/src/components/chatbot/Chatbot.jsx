import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiRobot2Fill } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import { getHistory, sendMessage } from '../../services/chatApi';
import ChatWindow from './ChatWindow';
import './chatbot.css';

const CHAT_SESSION_KEY = 'travelsphere_chat_session_id';
const WELCOME_MESSAGE = {
  role: 'assistant',
  content: 'Hello 👋\nI’m TravelSphere AI Assistant.\nI can help you find hotels, plan trips, and suggest destinations.',
};

const createSessionId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const getStoredSessionId = () => {
  const existing = localStorage.getItem(CHAT_SESSION_KEY);
  if (existing) return existing;

  const nextSessionId = createSessionId();
  localStorage.setItem(CHAT_SESSION_KEY, nextSessionId);
  return nextSessionId;
};

const normalizeHistory = (history = []) => {
  const messages = history
    .filter((message) => message?.role && message?.content)
    .map((message) => ({
      role: message.role,
      content: message.content,
      timestamp: message.timestamp
    }));

  return messages.length ? messages : [WELCOME_MESSAGE];
};

const Chatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [sessionId, setSessionId] = useState(() => getStoredSessionId());

  const identity = useMemo(() => ({
    sessionId,
    userId: user?.uid || user?.id || null,
    userEmail: user?.email || null
  }), [sessionId, user]);

  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      try {
        const history = await getHistory(identity);
        if (!isMounted) return;

        if (history.sessionId && history.sessionId !== sessionId) {
          localStorage.setItem(CHAT_SESSION_KEY, history.sessionId);
          setSessionId(history.sessionId);
        }

        setMessages(normalizeHistory(history.messages));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [identity.userId, identity.userEmail, identity.sessionId]);

  const handleSendMessage = async (text) => {
    const cleanText = text.trim();
    if (!cleanText || isLoading) return;

    const userMessage = { role: 'user', content: cleanText };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const data = await sendMessage({
        ...identity,
        message: cleanText,
        messages
      });

      if (data.sessionId && data.sessionId !== sessionId) {
        localStorage.setItem(CHAT_SESSION_KEY, data.sessionId);
        setSessionId(data.sessionId);
      }

      const reply = data.reply || data.message;
      if (!reply) throw new Error('No assistant reply returned');

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('Error sending chat message:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
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
