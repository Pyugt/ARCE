const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

const products = [
  {
    name: 'boAt Rockerz 450 Bluetooth Headphones',
    description: 'Over-ear wireless headphones with 15-hour playback, 40mm drivers, and foldable design. Compatible with all Bluetooth devices. Comes with an aux cable for wired use.',
    price: 1299,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    stock: 25,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Redgear MS-150 Wired Mechanical Keyboard',
    description: 'RGB backlit mechanical gaming keyboard with blue switches, anti-ghosting, and braided cable. Built for competitive gaming and long coding sessions.',
    price: 2499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    stock: 40,
    rating: 4.8,
    numReviews: 28,
  },
  {
    name: 'Titan Analog Wrist Watch',
    description: 'Classic stainless steel case analog watch with leather strap and mineral glass. Water-resistant up to 30m. Ideal for office and casual wear.',
    price: 2195,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    stock: 15,
    rating: 4.6,
    numReviews: 19,
  },
  {
    name: 'Let Us C by Yashavant Kanetkar',
    description: 'The most popular C programming book in India, covering fundamentals to advanced topics. Ideal for engineering students and beginners learning to code.',
    price: 399,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
    stock: 60,
    rating: 5.0,
    numReviews: 34,
  },
  {
    name: 'Green Soul Ergonomic Office Chair',
    description: 'Mesh back ergonomic chair with lumbar support, adjustable armrests, and seat height control. Designed for long work-from-home sessions.',
    price: 8999,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    stock: 10,
    rating: 4.3,
    numReviews: 8,
  },
  {
    name: 'Nivia Ultra Running Shoes',
    description: 'Lightweight mesh running shoes with EVA cushioning sole and breathable upper. Ideal for jogging, gym workouts, and everyday use.',
    price: 1499,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    stock: 35,
    rating: 4.7,
    numReviews: 45,
  },
  {
    name: 'Zebronics Zeb-Crystal Pro Webcam',
    description: 'Full HD 1080p webcam with built-in microphone, auto white balance, and plug-and-play USB connectivity. Great for video calls and online classes.',
    price: 1799,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop',
    stock: 50,
    rating: 4.4,
    numReviews: 22,
  },
  {
    name: 'The Intelligent Investor (Hindi Edition)',
    description: 'Benjamin Graham\'s timeless guide to value investing, now available in Hindi. Essential reading for anyone interested in the Indian stock market.',
    price: 499,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=300&fit=crop',
    stock: 80,
    rating: 4.9,
    numReviews: 56,
  },
  {
    name: 'Ugaoo Indoor Plant Combo (3 Plants)',
    description: 'Set of three easy-care indoor plants — Money Plant, Snake Plant, and Peace Lily — shipped in coco peat with ceramic pots. Perfect for Indian homes and offices.',
    price: 799,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=300&fit=crop',
    stock: 20,
    rating: 4.2,
    numReviews: 14,
  },
  {
    name: 'Boldfit Premium Yoga Mat',
    description: 'Extra-thick 6mm anti-slip yoga mat with alignment lines and carry strap. Made from eco-friendly TPE material. Suitable for yoga, pilates, and stretching.',
    price: 699,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    stock: 45,
    rating: 4.5,
    numReviews: 31,
  },
  {
    name: 'Ambrane 15W Wireless Charger Pad',
    description: 'Qi-compatible wireless charging pad with 15W fast charging for Android and 7.5W for iPhone. LED indicator and non-slip surface.',
    price: 799,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587316205196-4c8caff51ca0?w=400&h=300&fit=crop',
    stock: 65,
    rating: 4.1,
    numReviews: 17,
  },
  {
    name: 'Fabindia Cotton Kurta',
    description: 'Hand-block printed pure cotton kurta with a relaxed fit. Available in earthy tones. Machine washable and breathable — perfect for the Indian climate.',
    price: 1290,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=300&fit=crop',
    stock: 30,
    rating: 4.6,
    numReviews: 23,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing data...');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@shop.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create regular user
    const regularUser = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: 'password123',
      role: 'user',
    });

    // Seed products
    const seededProducts = await Product.insertMany(
      products.map((p) => ({ ...p, createdBy: adminUser._id }))
    );

    console.log(`✅ Seeded ${seededProducts.length} products`);
    console.log(`✅ Created admin: admin@shop.com / admin123`);
    console.log(`✅ Created user:  rahul@example.com / password123`);
    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
