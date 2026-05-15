import React from 'react';

const MessageBubble = ({ message, isBot }) => {
  return (
    <div className={`message-bubble ${isBot ? 'message-bot' : 'message-user'}`}>
      {message}
    </div>
  );
};

export default MessageBubble;
