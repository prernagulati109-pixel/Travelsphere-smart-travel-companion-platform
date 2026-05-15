import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { RiRobot2Line } from 'react-icons/ri';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

const ChatWindow = ({ messages, onSendMessage, onClose, isLoading, onQuickAction }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    'Beach Trips',
    'Budget Hotels',
    'Adventure Trips',
    'Honeymoon',
    'International Trips',
    'Luxury Hotels',
  ];

  return (
    <motion.div
      className="chat-window"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="chat-header">
        <div className="header-info">
          <div className="header-icon">
            <RiRobot2Line size={24} />
          </div>
          <div>
            <h3>TravelSphere AI</h3>
            <div className="header-status">
              <span className="status-dot"></span>
              <span>Online Assistant</span>
            </div>
          </div>
        </div>
        <button className="close-chat" onClick={onClose}>
          <IoClose size={20} />
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg.content} isBot={msg.role === 'assistant'} />
        ))}
        {isLoading && (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-actions">
        {quickActions.map((action) => (
          <button
            key={action}
            className="action-chip"
            onClick={() => onQuickAction(action)}
            disabled={isLoading}
          >
            {action}
          </button>
        ))}
      </div>

      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </motion.div>
  );
};

export default ChatWindow;
