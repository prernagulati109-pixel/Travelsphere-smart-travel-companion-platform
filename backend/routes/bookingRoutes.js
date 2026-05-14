import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const { 
      destination, 
      travelers, 
      travelDate, 
      selectedAttractions, 
      totalPrice, 
      customerName, 
      customerEmail 
    } = req.body;

    const newBooking = new Booking({
      destination,
      travelers,
      travelDate: travelDate || new Date(),
      selectedAttractions,
      totalPrice,
      customerName,
      customerEmail
    });

    await newBooking.save();

    console.log(`✅ Booking confirmed for ${customerName} to ${destination}`);
    
    res.status(201).json({ 
      success: true, 
      message: 'Booking confirmed successfully',
      bookingId: newBooking._id 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to process booking' });
  }
});

// Get all bookings (for admin/dashboard)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

export default router;
