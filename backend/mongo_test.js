import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';

// DNS fix for MongoDB SRV lookup
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
