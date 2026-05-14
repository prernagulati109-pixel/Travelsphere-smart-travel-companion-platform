import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    id: String, // Destination or Hotel ID
    name: String,
    image: String,
    type: {
      type: String,
      enum: ['destination', 'hotel'],
      required: true
    },
    location: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
