import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    await newContact.save();

    console.log('--- New Contact Form Saved to DB ---');
    console.log(`Name: ${name}`);
    console.log('-----------------------------------');

    res.status(200).json({ success: true, message: 'Message saved successfully' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Failed to save message to database' });
  }
});

export default router;
