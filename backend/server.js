const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Import Models
const Sweet = require('./models/Sweet');
const User = require('./models/User');

dotenv.config();

// --- 1. CONNECT TO DB & AUTO-SEED ---
if (process.env.NODE_ENV !== 'test') {
  // Connect to Database
  connectDB();

  // Listen for connection open to run seeding
  mongoose.connection.once('open', async () => {
    console.log('✅ MongoDB Connection Established');
    try {
      const sweetCount = await Sweet.countDocuments();
      if (sweetCount === 0) {
        console.log('🌱 Database appears empty. Auto-seeding initial data...');
        
        // Create Admin
        const adminExists = await User.findOne({ email: 'admin@sweetshop.com' });
        if (!adminExists) {
          await User.create({
            name: 'Shop Admin',
            email: 'admin@sweetshop.com',
            password: 'admin123',
            role: 'admin'
          });
          console.log('   -> Admin user created');
        }

        // Create Sweets (Using the detailed data you provided)
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
        console.log('✅ Auto-seeding complete!');
      }
    } catch (error) {
      console.error('⚠️ Auto-seed failed:', error);
    }
  });
}

const app = express();

// --- 2. FIXED CORS CONFIGURATION ---
app.use(cors({
  origin: [
    "http://localhost:5173", // Vite Local
    "http://localhost:8080", // Vite Local
    "http://localhost:3000", // React Local
    "https://cravier-sweet-shop-management-syste.vercel.app", // <--- REMOVED TRAILING SLASH (Fixes your error)
    "https://cravier-sweet-shop-management-system.vercel.app" // Added correct spelling just in case
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// --- 3. ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sweets', require('./routes/sweetRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Basic Health Check
app.get('/', (req, res) => {
  res.send('Sweet Shop API is running...');
});

// --- 4. RESET ROUTE (Keep this if you need to wipe DB) ---
app.get('/api/setup', async (req, res) => {
  try {
    console.log("⚠️ Force Reset Triggered");
    await User.deleteMany({});
    await Sweet.deleteMany({});
    
    // Create Admin
    await User.create({
      name: 'Shop Admin',
      email: 'admin@sweetshop.com',
      password: 'admin123',
      role: 'admin'
    });

    // We can just rely on the auto-seed logic on next restart, 
    // or insert here if you prefer. For now, simple reset is fine.
    
    res.send("✅ Database Cleared & Admin Reset! Restart server or use auto-seed.");
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

// --- 5. START SERVER ---
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;