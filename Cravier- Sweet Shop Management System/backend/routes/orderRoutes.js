const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

// GET /api/orders (User gets theirs, Admin gets all)
router.get('/', protect, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find({}).sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    }
    
    // Format _id to id for frontend compatibility
    const formatted = orders.map(o => ({
      id: o._id,
      userId: o.userId,
      userName: o.userName,
      items: o.items,
      totalPrice: o.totalPrice,
      status: o.status,
      createdAt: o.createdAt
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalPrice, userName } = req.body;
    const order = await Order.create({
      userId: req.user._id,
      userName: userName || req.user.name,
      items,
      totalPrice
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;