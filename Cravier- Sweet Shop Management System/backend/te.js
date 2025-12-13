// backend/check-db.js
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path if needed
require('dotenv').config();

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB. Fetching users...");
    
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log("⚠️ Database is connected but EMPTY.");
    } else {
      console.log(`🎉 Found ${users.length} user(s):`);
      users.forEach(u => console.log(` - ${u.name} (${u.email})`));
    }
    
    process.exit();
  } catch (error) {
    console.error("❌ Connection Error:", error);
    process.exit(1);
  }
};

checkDB();