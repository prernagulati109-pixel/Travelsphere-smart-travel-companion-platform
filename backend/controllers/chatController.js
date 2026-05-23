import crypto from 'node:crypto';
import ChatHistory from '../models/ChatHistory.js';
import { generateChatResponse } from '../services/geminiService.js';

const MAX_MESSAGE_LENGTH = 2000;
const rateBuckets = new Map();

const sanitizeText = (value) => {
  if (typeof value !== 'string') return '';
  return value.replace(/[<>]/g, '').trim().slice(0, MAX_MESSAGE_LENGTH);
};

const sanitizeIdentity = (value, maxLength = 160) => {
  if (typeof value !== 'string') return '';
  return value.replace(/[^\w@.+:-]/g, '').trim().slice(0, maxLength);
};

const getClientKey = (req, sessionId, userId) => userId || sessionId || req.ip || 'anonymous';

const isRateLimited = (key) => {
  const now = Date.now();
  const bucket = rateBuckets.get(key) || { count: 0, resetAt: now + 60_000 };

  if (bucket.resetAt < now) {
    bucket.count = 0;
    bucket.resetAt = now + 60_000;
  }

  bucket.count += 1;
  rateBuckets.set(key, bucket);
  return bucket.count > 20;
};

const normalizeMessages = (messages = []) => messages
  .filter((message) => message && ['user', 'assistant', 'system'].includes(message.role) && message.content)
  .map((message) => ({
    role: message.role,
    content: sanitizeText(message.content),
    timestamp: message.timestamp ? new Date(message.timestamp) : new Date()
  }))
  .filter((message) => message.content);

const getIdentity = (req) => {
  const body = req.body || {};
  const query = req.query || {};
  const params = req.params || {};

  const userId = sanitizeIdentity(body.userId || query.userId || req.user?.uid || req.user?.id || '');
  const userEmail = sanitizeIdentity(body.userEmail || query.userEmail || req.user?.email || '').toLowerCase();
  const sessionId = sanitizeIdentity(body.sessionId || params.sessionId || query.sessionId || crypto.randomUUID());

  return { userId: userId || null, userEmail: userEmail || null, sessionId };
};

const findConversation = async ({ userId, sessionId }) => {
  if (userId) {
    const byUser = await ChatHistory.findOne({ userId }).sort({ updatedAt: -1 });
    if (byUser) return byUser;
  }

  return ChatHistory.findOne({ sessionId }).sort({ updatedAt: -1 });
};

const updateMemory = (chat, text) => {
  const lower = text.toLowerCase();
  const budgetMatch = lower.match(/(?:rs\.?|₹|inr)?\s*(\d{4,7})/i);
  if (budgetMatch) chat.preferences.budget = Number(budgetMatch[1]);

  const seasonMatch = lower.match(/\b(summer|winter|monsoon|spring|autumn|fall|december|january|february|march|april|may|june|july|august|september|october|november)\b/i);
  if (seasonMatch) chat.preferences.season = seasonMatch[1];
};

export const handleChat = async (req, res) => {
  try {
    const identity = getIdentity(req);
    const key = getClientKey(req, identity.sessionId, identity.userId);

    if (isRateLimited(key)) {
      return res.status(429).json({ error: 'Too many chat requests. Please wait a minute and try again.' });
    }

    const bodyMessages = normalizeMessages(req.body?.messages || []);
    const lastUserMessage = [...bodyMessages].reverse().find((entry) => entry.role === 'user');
    const message = sanitizeText(req.body?.message || lastUserMessage?.content);
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    let chat = await findConversation(identity);
    if (!chat) {
      chat = new ChatHistory({
        userId: identity.userId,
        userEmail: identity.userEmail,
        sessionId: identity.sessionId,
        messages: [],
        preferences: {},
        context: {}
      });
    }

    if (identity.userId && chat.userId !== identity.userId) chat.userId = identity.userId;
    if (identity.userEmail && chat.userEmail !== identity.userEmail) chat.userEmail = identity.userEmail;
    if (!chat.sessionId) chat.sessionId = identity.sessionId;
    if (!chat.preferences) chat.preferences = {};
    if (!chat.context) chat.context = {};

    const suppliedMessages = bodyMessages.filter((entry) => entry !== lastUserMessage);
    const history = suppliedMessages.length ? suppliedMessages : chat.messages;
    const messagesForGemini = [...history, { role: 'user', content: message, timestamp: new Date() }];

    updateMemory(chat, message);

    const { response, toolCalls } = await generateChatResponse({
      messages: messagesForGemini,
      identity: {
        ...identity,
        preferences: chat.preferences,
        context: chat.context
      }
    });

    chat.messages.push({ role: 'user', content: message, timestamp: new Date() });
    chat.messages.push({
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      metadata: { toolCalls }
    });

    await chat.save();

    return res.json({
      reply: response,
      message: response,
      sessionId: chat.sessionId,
      userId: chat.userId,
      messages: chat.messages
    });
  } catch (error) {
    console.error('Chat controller error:', error);
    return res.status(500).json({
      error: 'The TravelSphere assistant is unavailable right now. Please try again shortly.',
      details: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const identity = getIdentity(req);
    const chat = await findConversation(identity);

    if (!chat) {
      return res.json({
        sessionId: identity.sessionId,
        userId: identity.userId,
        messages: []
      });
    }

    return res.json({
      sessionId: chat.sessionId,
      userId: chat.userId,
      userEmail: chat.userEmail,
      messages: chat.messages || [],
      preferences: chat.preferences || {},
      context: chat.context || {}
    });
  } catch (error) {
    console.error('Chat history error:', error);
    return res.status(500).json({ error: 'Failed to load chat history.' });
  }
};
