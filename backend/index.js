import express from 'express';
import dns from 'node:dns';

// Fix for MongoDB Atlas DNS SRV lookup issues on some networks
dns.setServers(['8.8.8.8', '8.8.4.4']);
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import mongoose from 'mongoose';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("----------------------------");
    console.log("✅ Connected to MongoDB Atlas");
    console.log("----------------------------");
  })
  .catch((err) => {
    console.log("----------------------------");
    console.log("❌ MongoDB Connection Error:");
    console.log(err.message);
    console.log("----------------------------");
  });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Verify environment variables at startup
console.log("--- Server Configuration ---");
console.log("PORT:", PORT);
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Found (masked)" : "MISSING");
console.log("----------------------------");


// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.get('/', (req, res) => {
  res.send('TravelSphere AI Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
