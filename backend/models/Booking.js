import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true
  },
  travelers: {
    type: Number,
    required: true,
    default: 1
  },
  travelDate: {
    type: Date,
    required: true
  },
  selectedAttractions: [{
    type: String
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
