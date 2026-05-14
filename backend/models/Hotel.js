import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  description: String,
  amenities: [String],
  images: [String],
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
