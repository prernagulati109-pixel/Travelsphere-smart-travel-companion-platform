import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  maxPeople: {
    type: Number,
    required: true
  },
  description: String,
  roomNumbers: [{ number: Number, unavailableDates: { type: [Date] } }],
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
