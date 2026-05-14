import express from 'express';
import Wishlist from '../models/Wishlist.js';

const router = express.Router();

// Get user wishlist
router.get('/:userId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId });
    res.json(wishlist ? wishlist.items : []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Toggle wishlist item
router.post('/toggle', async (req, res) => {
  const { userId, item } = req.body;
  
  if (!userId || !item) {
    return res.status(400).json({ error: 'User ID and item are required' });
  }

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [item] });
    } else {
      const existingIndex = wishlist.items.findIndex(i => 
        i.id === item.id && i.type === item.type
      );

      if (existingIndex > -1) {
        // Remove item
        wishlist.items.splice(existingIndex, 1);
      } else {
        // Add item
        wishlist.items.push(item);
      }
    }

    await wishlist.save();
    res.json({ success: true, items: wishlist.items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

export default router;
