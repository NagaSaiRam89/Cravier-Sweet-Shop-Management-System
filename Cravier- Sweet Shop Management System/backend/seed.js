const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Sweet = require('./models/Sweet');
const User = require('./models/User');

dotenv.config();

const sweets = [
  { name: 'Belgian Dark Chocolate', category: 'Chocolates', price: 12.99, quantity: 25, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400', description: 'Rich and intense dark chocolate' },
  { name: 'Strawberry Macarons', category: 'Pastries', price: 8.99, quantity: 40, image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400', description: 'Delicate French macarons' },
  { name: 'Butter Cookies', category: 'Cookies', price: 6.99, quantity: 0, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', description: 'Classic Danish butter cookies' },
  { name: 'Vanilla Bean Cheesecake', category: 'Cakes', price: 24.99, quantity: 8, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', description: 'Creamy New York style cheesecake' },
  { name: 'Fruit Gummy Bears', category: 'Candies', price: 4.99, quantity: 100, image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400', description: 'Colorful gummy bears' },
  { name: 'Salted Caramel Truffles', category: 'Chocolates', price: 15.99, quantity: 20, image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400', description: 'Handcrafted truffles' },
  { name: 'Pistachio Gelato', category: 'Ice Cream', price: 7.99, quantity: 15, image: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=400', description: 'Authentic Italian gelato' },
  { name: 'Gulab Jamun', category: 'Traditional', price: 9.99, quantity: 30, image: 'https://images.unsplash.com/photo-1666190077484-ec5ed4906ffc?w=400', description: 'Traditional Indian sweet' }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Sweet.deleteMany();
    await User.deleteMany();

    await Sweet.insertMany(sweets);
    await User.create({
      name: 'Admin User',
      email: 'admin@sweetshop.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();