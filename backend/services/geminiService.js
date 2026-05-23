import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import mongoose from 'mongoose';
import Hotel from '../models/Hotel.js';
import TravelPackage from '../models/TravelPackage.js';
import Booking from '../models/Booking.js';
import FAQ from '../models/FAQ.js';
import User from '../models/User.js';

const SYSTEM_PROMPT = `You are TravelSphere AI Assistant.

Help users with:
- Hotel bookings
- Travel packages
- Payment help
- Booking status
- Travel planning
- Itinerary downloads
- Login/account issues
- Budget suggestions

Always answer politely and accurately.
Use real database information whenever available.

Rules:
- Use tools whenever the user asks for hotels, packages, bookings, payments, FAQs, or itinerary data.
- Do not invent hotel names, prices, booking IDs, payment IDs, policies, or package details.
- If the database has no matching data, say that clearly and suggest the next best action.
- Keep answers concise, helpful, and easy to scan.
- Default currency is INR.`;

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const MAX_HISTORY_MESSAGES = 20;
const MAX_TOOL_LOOPS = 4;
const REQUEST_TIMEOUT_MS = 30000;

let genAI;

const getClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing');
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  return genAI;
};

const sanitizeText = (value, maxLength = 2000) => {
  if (typeof value !== 'string') return '';
  return value.replace(/[<>]/g, '').trim().slice(0, maxLength);
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const withTimeout = (promise, timeoutMs = REQUEST_TIMEOUT_MS) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Gemini request timed out')), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

const compactHotel = (hotel) => ({
  id: hotel._id?.toString(),
  name: hotel.name,
  location: hotel.location,
  pricePerNight: hotel.pricePerNight,
  rating: hotel.rating,
  reviewsCount: hotel.reviewsCount,
  amenities: hotel.amenities || [],
  description: hotel.description || ''
});

const compactPackage = (pkg) => ({
  id: pkg._id?.toString(),
  title: pkg.title,
  destination: pkg.destination,
  duration: pkg.duration,
  price: pkg.price,
  availableSeats: pkg.availableSeats,
  itinerary: pkg.itinerary || [],
  description: pkg.description || ''
});

const compactBooking = (booking) => ({
  id: booking._id?.toString(),
  destination: booking.destination,
  travelers: booking.travelers,
  travelDate: booking.travelDate,
  selectedAttractions: booking.selectedAttractions || [],
  totalPrice: booking.totalPrice,
  customerName: booking.customerName,
  customerEmail: booking.customerEmail,
  status: booking.status,
  createdAt: booking.createdAt
});

const toolDeclarations = [
  {
    name: 'searchHotels',
    description: 'Search real TravelSphere hotels by location, maximum budget per night, and minimum rating.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        location: { type: SchemaType.STRING, description: 'City or location, for example Delhi, Goa, Manali.' },
        budget: { type: SchemaType.NUMBER, description: 'Maximum price per night in INR.' },
        rating: { type: SchemaType.NUMBER, description: 'Minimum hotel rating.' }
      },
      required: ['location']
    }
  },
  {
    name: 'searchPackages',
    description: 'Search real TravelSphere travel packages by destination and optional price range.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        destination: { type: SchemaType.STRING, description: 'Destination to search.' },
        priceRange: { type: SchemaType.STRING, description: 'Budget or range such as under 50000 or 20000-60000.' }
      },
      required: ['destination']
    }
  },
  {
    name: 'getBookingStatus',
    description: 'Get a real booking status by booking ID.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        bookingId: { type: SchemaType.STRING, description: 'MongoDB booking ID.' }
      },
      required: ['bookingId']
    }
  },
  {
    name: 'getPaymentStatus',
    description: 'Get real payment status by payment ID from the payments collection if available.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        paymentId: { type: SchemaType.STRING, description: 'Payment ID.' }
      },
      required: ['paymentId']
    }
  },
  {
    name: 'getUserBookings',
    description: 'Get real bookings for the logged-in user. Use the provided authenticated user identity when possible.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        userId: { type: SchemaType.STRING, description: 'Authenticated user ID.' }
      }
    }
  },
  {
    name: 'downloadItinerary',
    description: 'Get itinerary data for a booking so the user can download or view it.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        bookingId: { type: SchemaType.STRING, description: 'MongoDB booking ID.' }
      },
      required: ['bookingId']
    }
  },
  {
    name: 'suggestDestinations',
    description: 'Suggest real destinations from TravelSphere hotels and packages based on budget and season.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        budget: { type: SchemaType.NUMBER, description: 'Maximum budget in INR.' },
        season: { type: SchemaType.STRING, description: 'Travel season or month.' }
      }
    }
  },
  {
    name: 'getFAQs',
    description: 'Search real FAQ records by topic.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        topic: { type: SchemaType.STRING, description: 'FAQ topic such as refund, cancellation, login, payment, booking.' }
      },
      required: ['topic']
    }
  }
];

const parsePriceRange = (priceRange) => {
  const text = sanitizeText(priceRange, 80).toLowerCase();
  if (!text) return {};

  const numbers = text.match(/\d+/g)?.map(Number) || [];
  if (text.includes('under') || text.includes('below') || text.includes('less') || text.includes('upto') || text.includes('up to')) {
    return { max: numbers[0] };
  }

  if (numbers.length >= 2) return { min: Math.min(numbers[0], numbers[1]), max: Math.max(numbers[0], numbers[1]) };
  if (numbers.length === 1) return { max: numbers[0] };
  return {};
};

const buildHotelQuery = ({ location, budget, rating }) => {
  const query = {};
  const cleanLocation = sanitizeText(location, 120);
  const maxBudget = toNumber(budget);
  const minRating = toNumber(rating);

  if (cleanLocation) query.location = { $regex: escapeRegex(cleanLocation), $options: 'i' };
  if (maxBudget !== undefined) query.pricePerNight = { $lte: maxBudget };
  if (minRating !== undefined) query.rating = { $gte: minRating };

  return query;
};

const tools = {
  async searchHotels(args = {}) {
    const query = buildHotelQuery(args);
    const hotels = await Hotel.find(query).sort({ rating: -1, pricePerNight: 1 }).limit(8).lean();
    return { count: hotels.length, hotels: hotels.map(compactHotel) };
  },

  async searchPackages(args = {}) {
    const query = {};
    const destination = sanitizeText(args.destination, 120);
    const { min, max } = parsePriceRange(args.priceRange);

    if (destination) query.destination = { $regex: escapeRegex(destination), $options: 'i' };
    if (min !== undefined || max !== undefined) {
      query.price = {};
      if (min !== undefined) query.price.$gte = min;
      if (max !== undefined) query.price.$lte = max;
    }

    const packages = await TravelPackage.find(query).sort({ price: 1 }).limit(8).lean();
    return { count: packages.length, packages: packages.map(compactPackage) };
  },

  async getBookingStatus(args = {}, identity = {}) {
    const bookingId = sanitizeText(args.bookingId, 80);
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return { found: false, message: 'That booking ID is not valid.' };
    }

    const booking = await Booking.findById(bookingId).lean();
    if (!booking) return { found: false, message: 'No booking was found with that ID.' };

    if (identity.userEmail && booking.customerEmail?.toLowerCase() !== identity.userEmail.toLowerCase()) {
      return { found: false, message: 'For privacy, I can only show this booking to the account email that owns it.' };
    }

    return { found: true, booking: compactBooking(booking) };
  },

  async getPaymentStatus(args = {}, identity = {}) {
    const paymentId = sanitizeText(args.paymentId, 100);
    if (!paymentId) return { found: false, message: 'Payment ID is required.' };

    const collectionNames = (await mongoose.connection.db.listCollections().toArray()).map((c) => c.name);
    if (!collectionNames.includes('payments')) {
      return { found: false, message: 'No payments collection is configured in this database yet.' };
    }

    const query = mongoose.Types.ObjectId.isValid(paymentId)
      ? { $or: [{ _id: new mongoose.Types.ObjectId(paymentId) }, { paymentId }] }
      : { paymentId };

    const payment = await mongoose.connection.db.collection('payments').findOne(query);
    if (!payment) return { found: false, message: 'No payment was found with that ID.' };

    if (identity.userId && payment.userId && payment.userId !== identity.userId) {
      return { found: false, message: 'For privacy, I can only show payment details for the signed-in account.' };
    }

    return {
      found: true,
      payment: {
        id: payment._id?.toString(),
        paymentId: payment.paymentId,
        bookingId: payment.bookingId,
        amount: payment.amount,
        status: payment.status,
        method: payment.method,
        createdAt: payment.createdAt
      }
    };
  },

  async getUserBookings(args = {}, identity = {}) {
    const requestedUserId = sanitizeText(args.userId, 120);
    const userId = identity.userId || requestedUserId;
    const userEmail = identity.userEmail;
    const query = {};

    if (userEmail) {
      query.customerEmail = { $regex: `^${escapeRegex(userEmail)}$`, $options: 'i' };
    } else if (userId) {
      const user = await User.findOne({ $or: [{ uid: userId }, { _id: mongoose.Types.ObjectId.isValid(userId) ? userId : undefined }].filter(Boolean) }).lean();
      if (user?.email) query.customerEmail = { $regex: `^${escapeRegex(user.email)}$`, $options: 'i' };
    }

    if (!Object.keys(query).length) {
      return { count: 0, bookings: [], message: 'Please log in or share the booking ID to check bookings.' };
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 }).limit(10).lean();
    return { count: bookings.length, bookings: bookings.map(compactBooking) };
  },

  async downloadItinerary(args = {}, identity = {}) {
    const bookingResult = await tools.getBookingStatus(args, identity);
    if (!bookingResult.found) return bookingResult;

    const booking = bookingResult.booking;
    const packages = await TravelPackage.find({
      destination: { $regex: escapeRegex(booking.destination || ''), $options: 'i' }
    }).limit(3).lean();

    return {
      found: true,
      booking,
      itinerary: {
        destination: booking.destination,
        travelDate: booking.travelDate,
        travelers: booking.travelers,
        selectedAttractions: booking.selectedAttractions,
        matchingPackages: packages.map(compactPackage),
        downloadHint: 'The itinerary can be downloaded from the booking or itinerary page when available.'
      }
    };
  },

  async suggestDestinations(args = {}) {
    const budget = toNumber(args.budget);
    const season = sanitizeText(args.season, 80);
    const packageQuery = {};
    const hotelQuery = {};

    if (budget !== undefined) {
      packageQuery.price = { $lte: budget };
      hotelQuery.pricePerNight = { $lte: Math.max(Math.round(budget / 3), 1000) };
    }

    if (season) {
      packageQuery.$or = [
        { destination: { $regex: escapeRegex(season), $options: 'i' } },
        { description: { $regex: escapeRegex(season), $options: 'i' } },
        { title: { $regex: escapeRegex(season), $options: 'i' } }
      ];
    }

    const [packages, hotels] = await Promise.all([
      TravelPackage.find(packageQuery).sort({ price: 1 }).limit(6).lean(),
      Hotel.find(hotelQuery).sort({ rating: -1 }).limit(6).lean()
    ]);

    const destinations = [...new Set([
      ...packages.map((pkg) => pkg.destination),
      ...hotels.map((hotel) => hotel.location)
    ].filter(Boolean))];

    return {
      destinations,
      packages: packages.map(compactPackage),
      hotels: hotels.map(compactHotel),
      budget,
      season
    };
  },

  async getFAQs(args = {}) {
    const topic = sanitizeText(args.topic, 100);
    const regex = { $regex: escapeRegex(topic), $options: 'i' };
    const faqs = await FAQ.find({
      $or: [
        { topic: regex },
        { category: regex },
        { question: regex },
        { answer: regex },
        { keywords: regex }
      ]
    }).limit(5).lean();

    return {
      count: faqs.length,
      faqs: faqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
        topic: faq.topic || faq.category
      }))
    };
  }
};

const toGeminiHistory = (messages = []) => {
  const normalized = messages
    .filter((message) => ['user', 'assistant', 'model'].includes(message.role) && message.content)
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({
      role: message.role === 'assistant' || message.role === 'model' ? 'model' : 'user',
      parts: [{ text: sanitizeText(message.content, 4000) }]
    }));

  while (normalized.length && normalized[0].role !== 'user') {
    normalized.shift();
  }

  return normalized;
};

const extractFunctionCall = (response) => {
  const parts = response?.candidates?.[0]?.content?.parts || [];
  return parts.find((part) => part.functionCall)?.functionCall || null;
};

export const generateChatResponse = async ({ messages, identity = {} }) => {
  const client = getClient();
  const identityPrompt = [
    identity.userId ? `Authenticated userId: ${identity.userId}` : 'The user may be a guest.',
    identity.userEmail ? `Authenticated email: ${identity.userEmail}` : '',
    identity.sessionId ? `Chat sessionId: ${identity.sessionId}` : ''
  ].filter(Boolean).join('\n');

  const model = client.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: `${SYSTEM_PROMPT}\n\n${identityPrompt}`,
    tools: [{ functionDeclarations: toolDeclarations }]
  });

  const contents = toGeminiHistory(messages);
  let result = await withTimeout(model.generateContent({
    contents,
    generationConfig: { temperature: 0.4, maxOutputTokens: 1400 }
  }));

  const toolCalls = [];
  let loops = MAX_TOOL_LOOPS;

  while (loops > 0) {
    loops -= 1;
    const functionCall = extractFunctionCall(result.response);
    if (!functionCall) break;

    const { name, args = {} } = functionCall;
    const executor = tools[name];
    const toolResult = executor
      ? await executor(args, identity)
      : { error: `Unknown tool requested: ${name}` };

    toolCalls.push({ name, args, result: toolResult });
    contents.push({ role: 'model', parts: [{ functionCall: { name, args } }] });
    contents.push({ role: 'function', parts: [{ functionResponse: { name, response: toolResult } }] });

    result = await withTimeout(model.generateContent({
      contents,
      generationConfig: { temperature: 0.4, maxOutputTokens: 1400 }
    }));
  }

  const response = result.response.text();
  if (!response) throw new Error('Gemini returned an empty response');

  return { response, toolCalls };
};

export const getChatResponse = async (messages, userEmail = null) => {
  const { response } = await generateChatResponse({
    messages,
    identity: { userEmail }
  });
  return response;
};
