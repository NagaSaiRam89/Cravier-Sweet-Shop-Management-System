const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Added for database events
const connectDB = require('./config/db');

// Import Models for Auto-Seeding
const Sweet = require('./models/Sweet');
const User = require('./models/User');

dotenv.config();

// --- AUTO-SEED LOGIC ---

// This listens for the database to open, then checks if it's empty
if (process.env.NODE_ENV !== 'test') {
  mongoose.connection.once('open', async () => {
    console.log('✅ MongoDB Connection Established');

    try {
      const sweetCount = await Sweet.countDocuments();
      
      if (sweetCount === 0) {
        console.log('🌱 Database appears empty. Auto-seeding initial data...');

        // 1. Create Admin User
        const adminExists = await User.findOne({ email: 'admin@sweetshop.com' });
        if (!adminExists) {
          await User.create({
            name: 'Shop Admin',
            email: 'admin@sweetshop.com',
            password: 'admin123', // Will be hashed by your User model
            role: 'admin'
          });
          console.log('   -> Admin user created');
        }

        // 2. Create Sample Sweets
        await Sweet.insertMany([
          {
            name: 'Belgian Dark Chocolate',
            description: 'Rich and intense dark chocolate made from premium Belgian cocoa.',
            category: 'Chocolates',
            price: 12.99,
            quantity: 25,
            image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400'
          },
          {
            name: 'Strawberry Macarons',
            description: 'Delicate French macarons with fresh strawberry filling.',
            category: 'Pastries',
            price: 8.99,
            quantity: 40,
            image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400'
          },
          {
            name: 'Vanilla Bean Cheesecake',
            description: 'Creamy New York style cheesecake with real vanilla beans.',
            category: 'Cakes',
            price: 24.99,
            quantity: 8,
            image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400'
          },
          {
            name: 'Salted Caramel Truffles',
            description: 'Handcrafted truffles with a perfect balance of sweet and salty.',
            category: 'Chocolates',
            price: 15.99,
            quantity: 20,
            image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400'
          },
          {
            name: 'Rainbow Lollipop',
            description: 'Classic swirled lollipop with fruit flavors.',
            category: 'Candies',
            price: 2.99,
            quantity: 100,
            image: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=400'
          },
          {
            name: 'Glazed Donuts',
            description: 'Freshly baked fluffy donuts with sugar glaze.',
            category: 'Pastries',
            price: 4.50,
            quantity: 12,
            image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400'
          }
        ]);
        console.log('   -> Sample sweets inserted');
        console.log('✅ Auto-seeding complete! You can log in as admin@sweetshop.com / admin123');
      }
    } catch (error) {
      console.error('⚠️ Auto-seed failed:', error);
    }
  });
}

// Connect to DB
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

app.use(cors({
  origin: [
    "http://localhost:8080",                 // Local development
    "https://cravier-sweet-shop-management-syste.vercel.app/" // <--- ADD YOUR VERCEL URL HERE
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sweets', require('./routes/sweetRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.get('/', (req, res) => {
  res.send('Sweet Shop API is running...');
});

// Export app for testing
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;