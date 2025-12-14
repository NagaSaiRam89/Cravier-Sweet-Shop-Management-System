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



// --- TEMPORARY RESET ROUTE ---
app.get('/api/setup', async (req, res) => {
  try {
    console.log("⚠️ Force Reset Triggered");
    
    // 1. Clear Database
    await User.deleteMany({});
    await Sweet.deleteMany({});
    
    // 2. Create Admin
    await User.create({
      name: 'Shop Admin',
      email: 'admin@sweetshop.com',
      password: 'admin123',
      role: 'admin'
    });

    // 3. Create Sweets
    await Sweet.insertMany([
      {
        id: '1',
        name: 'Belgian Dark Chocolate',
        description: 'Rich and intense dark chocolate made from premium Belgian cocoa',
        category: 'Chocolates',
        price: 12.99,
        quantity: 25,
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Strawberry Macarons',
        description: 'Delicate French macarons with fresh strawberry filling',
        category: 'Pastries',
        price: 8.99,
        quantity: 40,
        image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Butter Cookies',
        description: 'Classic Danish butter cookies with a melt-in-your-mouth texture',
        category: 'Cookies',
        price: 6.99,
        quantity: 0,
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Vanilla Bean Cheesecake',
        description: 'Creamy New York style cheesecake with real vanilla beans',
        category: 'Cakes',
        price: 24.99,
        quantity: 8,
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'Fruit Gummy Bears',
        description: 'Colorful gummy bears made with real fruit juice',
        category: 'Candies',
        price: 4.99,
        quantity: 100,
        image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '6',
        name: 'Salted Caramel Truffles',
        description: 'Handcrafted truffles with a perfect balance of sweet and salty',
        category: 'Chocolates',
        price: 15.99,
        quantity: 20,
        image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '7',
        name: 'Pistachio Gelato',
        description: 'Authentic Italian gelato made with Sicilian pistachios',
        category: 'Ice Cream',
        price: 7.99,
        quantity: 15,
        image: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '8',
        name: 'Gulab Jamun',
        description: 'Traditional Indian sweet dumplings soaked in rose syrup',
        category: 'Traditional',
        price: 9.99,
        quantity: 30,
        image: 'https://images.unsplash.com/photo-1666190077484-ec5ed4906ffc?w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '9',
        name: 'Red Velvet Cupcake',
        description: 'Moist red velvet cupcakes with cream cheese frosting',
        category: 'Cakes',
        price: 5.99,
        quantity: 45,
        image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '10',
        name: 'Almond Biscotti',
        description: 'Crunchy Italian biscotti perfect for dipping in coffee',
        category: 'Cookies',
        price: 8.49,
        quantity: 35,
        image: 'https://images.unsplash.com/photo-1619149651173-a4d8de2ec33a?w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '11',
        name: 'Mango Sticky Rice',
        description: 'Thai dessert with sweet coconut sticky rice and fresh mango',
        category: 'Traditional',
        price: 11.99,
        quantity: 12,
        image: 'https://images.unsplash.com/photo-1621293954908-907159247fc8?w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '12',
        name: 'Lollipop Collection',
        description: 'Artisanal lollipops in assorted fruit flavors',
        category: 'Candies',
        price: 3.99,
        quantity: 80,
        image: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },    
    ]);

    res.send("✅ Database Reset Successfully! You can now login with: admin@sweetshop.com / admin123");
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});
// --- END RESET ROUTE ---

// ... existing app.listen code

// Export app for testing
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;