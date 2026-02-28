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
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and studio-quality sound. Perfect for music lovers and remote workers.',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    stock: 25,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with Cherry MX switches, anti-ghosting, and aluminum frame. Built for competitive gaming.',
    price: 149.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    stock: 40,
    rating: 4.8,
    numReviews: 28,
  },
  {
    name: 'Minimalist Leather Watch',
    description: 'Handcrafted genuine leather strap watch with Japanese quartz movement. Water-resistant to 50m. Timeless design for everyday wear.',
    price: 189.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    stock: 15,
    rating: 4.6,
    numReviews: 19,
  },
  {
    name: 'The Art of Computer Programming',
    description: 'Donald Knuth\'s landmark multi-volume work covering fundamental algorithms. An essential reference for every serious programmer.',
    price: 79.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
    stock: 60,
    rating: 5.0,
    numReviews: 34,
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Lumbar support mesh chair with adjustable armrests, seat height, and tilt tension. Designed for long work sessions.',
    price: 449.99,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    stock: 10,
    rating: 4.3,
    numReviews: 8,
  },
  {
    name: 'Pro Running Shoes',
    description: 'Lightweight carbon-fiber running shoes with responsive foam cushioning and breathable mesh upper. Built for performance.',
    price: 129.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    stock: 35,
    rating: 4.7,
    numReviews: 45,
  },
  {
    name: '4K Webcam',
    description: 'Ultra HD 4K webcam with auto-focus, low-light correction, and dual noise-cancelling microphones. Great for streaming and video calls.',
    price: 99.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop',
    stock: 50,
    rating: 4.4,
    numReviews: 22,
  },
  {
    name: 'Clean Code by Robert Martin',
    description: 'A handbook of agile software craftsmanship. Learn how to write clean, readable, and maintainable code that lasts.',
    price: 39.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=300&fit=crop',
    stock: 80,
    rating: 4.9,
    numReviews: 56,
  },
  {
    name: 'Indoor Plant Set (3-Pack)',
    description: 'Curated set of low-maintenance indoor plants including pothos, snake plant, and ZZ plant. Ships in decorative ceramic pots.',
    price: 59.99,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=300&fit=crop',
    stock: 20,
    rating: 4.2,
    numReviews: 14,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra-thick 6mm eco-friendly TPE yoga mat with alignment lines, non-slip texture, and carrying strap. Supports all yoga styles.',
    price: 49.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    stock: 45,
    rating: 4.5,
    numReviews: 31,
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charger supporting Qi standard, 15W output for compatible devices. Sleek matte finish. Works with iPhone and Android.',
    price: 34.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587316205196-4c8caff51ca0?w=400&h=300&fit=crop',
    stock: 65,
    rating: 4.1,
    numReviews: 17,
  },
  {
    name: 'Merino Wool Hoodie',
    description: 'Premium merino wool blend hoodie with kangaroo pocket. Temperature-regulating, odor-resistant, and machine washable.',
    price: 119.99,
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
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    });

    // Seed products
    const seededProducts = await Product.insertMany(
      products.map((p) => ({ ...p, createdBy: adminUser._id }))
    );

    console.log(`✅ Seeded ${seededProducts.length} products`);
    console.log(`✅ Created admin: admin@shop.com / admin123`);
    console.log(`✅ Created user:  john@example.com / password123`);
    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
