import mongoose from 'mongoose';

const travelPackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String, // e.g. "5 Days / 4 Nights"
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  itinerary: {
    type: [String], // Array of day descriptions
    default: []
  },
  availableSeats: {
    type: Number,
    default: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
travelPackageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const TravelPackage = mongoose.model('TravelPackage', travelPackageSchema);

export default TravelPackage;
