const express = require('express');
const router = express.Router();
const Sweet = require('../models/Sweet');
const { protect, admin } = require('../middleware/authMiddleware');

// GET /api/sweets
router.get('/', async (req, res) => {
  const sweets = await Sweet.find({});
  res.json(sweets);
});

// GET /api/sweets/search (Matches SearchFilter.tsx)
router.get('/search', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    let query = {};

    if (search) query.name = { $regex: search, $options: 'i' };
    if (category && category !== 'all') query.category = category;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query);
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/sweets (Admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const sweet = await Sweet.create(req.body);
    res.status(201).json(sweet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/sweets/:id (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(sweet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/sweets/:id (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Sweet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sweet removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/sweets/:id/purchase
// NOTE: Frontend calls this in a loop for each item quantity. 
// We decrease stock by 1 per call.
router.post('/:id/purchase', protect, async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    
    if (sweet.quantity < 1) {
      return res.status(400).json({ message: 'Sweet out of stock' });
    }

    sweet.quantity = sweet.quantity - 1;
    await sweet.save();
    res.json(sweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/sweets/:id/restock (Admin)
router.post('/:id/restock', protect, admin, async (req, res) => {
  try {
    const { amount } = req.body;
    const sweet = await Sweet.findById(req.params.id);
    sweet.quantity += parseInt(amount);
    await sweet.save();
    res.json(sweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;