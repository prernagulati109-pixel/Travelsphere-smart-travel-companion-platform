import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
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
  },
  metadata: {
    toolCalls: [{
      name: String,
      args: mongoose.Schema.Types.Mixed,
      result: mongoose.Schema.Types.Mixed
    }]
  }
}, { _id: false });

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    index: true,
    default: null
  },
  userEmail: {
    type: String,
    index: true,
    lowercase: true,
    trim: true,
    default: null
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  messages: [chatMessageSchema],
  preferences: {
    destinations: [String],
    budget: Number,
    season: String
  },
  context: {
    lastIntent: String,
    lastDestination: String,
    lastBudget: Number
  }
}, {
  timestamps: true
});

chatHistorySchema.index({ userId: 1, updatedAt: -1 });
chatHistorySchema.index({ sessionId: 1, updatedAt: -1 });

export default mongoose.models.ChatHistory || mongoose.model('ChatHistory', chatHistorySchema);
