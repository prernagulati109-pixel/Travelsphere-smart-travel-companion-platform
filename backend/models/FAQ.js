import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  topic: {
    type: String,
    trim: true,
    index: true
  },
  category: {
    type: String,
    trim: true,
    index: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  keywords: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

faqSchema.index({ question: 'text', answer: 'text', topic: 'text', category: 'text', keywords: 'text' });

export default mongoose.models.FAQ || mongoose.model('FAQ', faqSchema);
