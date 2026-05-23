import express from 'express';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import TravelPackage from '../models/TravelPackage.js';
import { verifyAdmin } from '../middleware/adminAuth.js';
import admin from 'firebase-admin';

const router = express.Router();

// --- Setup / Seeding Route ---
// Allows creating the first admin account. In a real app, this should be disabled or protected by a strong secret.
router.post('/setup', async (req, res) => {
  try {
    const { email, password, name, setupSecret } = req.body;
    
    // Simple security measure
    if (setupSecret !== (process.env.ADMIN_SETUP_SECRET || 'travelsphere-admin-2026')) {
      return res.status(403).json({ success: false, error: 'Invalid setup secret' });
    }

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Add user to Firestore 'admins' collection
    const db = admin.firestore();
    await db.collection('admins').doc(userRecord.uid).set({
      adminId: userRecord.uid,
      name,
      email,
      role: 'superadmin',
      createdAt: new Date().toISOString(),
      lastLogin: null
    });

    res.status(201).json({ success: true, message: 'Admin account created successfully', uid: userRecord.uid });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to create admin account' });
  }
});

// Protect all routes below this line
router.use(verifyAdmin);

// Get Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalHotels = await Hotel.countDocuments();
    const totalPackages = await TravelPackage.countDocuments();
    
    // Calculate total revenue from bookings
    const bookings = await Booking.find();
    const revenue = bookings.reduce((sum, booking) => {
      // Only count revenue for confirmed/completed bookings if you prefer, or all. 
      // The prompt asks to calculate revenue using Booking model.
      if (booking.status !== 'cancelled' && booking.status !== 'rejected') {
        return sum + (Number(booking.totalPrice) || 0);
      }
      return sum;
    }, 0);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalBookings,
        totalHotels,
        totalPackages,
        revenue
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard stats' });
  }
});

// --- Hotel Management ---

// Get all hotels
router.get('/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    res.json({ success: true, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch hotels' });
  }
});

// Add a new hotel
router.post('/hotels', async (req, res) => {
  try {
    const newHotel = new Hotel(req.body);
    await newHotel.save();
    res.status(201).json({ success: true, data: newHotel });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add hotel' });
  }
});

// Update a hotel
router.put('/hotels/:id', async (req, res) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedHotel) {
      return res.status(404).json({ success: false, error: 'Hotel not found' });
    }
    res.json({ success: true, data: updatedHotel });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update hotel' });
  }
});

// Delete a hotel
router.delete('/hotels/:id', async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete hotel' });
  }
});

// --- Room Management ---
import Room from '../models/Room.js';

router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find().populate('hotelId', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch rooms' });
  }
});

router.post('/rooms', async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.status(201).json({ success: true, data: newRoom });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add room' });
  }
});

router.put('/rooms/:id', async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updatedRoom });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update room' });
  }
});

router.delete('/rooms/:id', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete room' });
  }
});

// --- User Management ---
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete user' });
  }
});

router.put('/users/:id/ban', async (req, res) => {
  try {
    const { isBanned } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { isBanned }, { new: true });
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to ban/unban user' });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const { isAdmin } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { isAdmin }, { new: true });
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update user role' });
  }
});

// --- Booking Management ---
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
  }
});

router.put('/bookings/:id', async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update booking' });
  }
});

// --- Travel Package Management ---
router.get('/packages', async (req, res) => {
  try {
    const packages = await TravelPackage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch packages' });
  }
});

router.post('/packages', async (req, res) => {
  try {
    const newPackage = new TravelPackage(req.body);
    await newPackage.save();
    res.status(201).json({ success: true, data: newPackage });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create package' });
  }
});

router.put('/packages/:id', async (req, res) => {
  try {
    const updatedPackage = await TravelPackage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updatedPackage });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update package' });
  }
});

router.delete('/packages/:id', async (req, res) => {
  try {
    await TravelPackage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete package' });
  }
});

export default router;
