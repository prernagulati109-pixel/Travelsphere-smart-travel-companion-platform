import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  userId: {
    type: String, // Can be session ID or actual User ID if auth is added later
    default: 'anonymous'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
