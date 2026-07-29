import { config } from 'dotenv';
config();

import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/order.js';

// Setup ES module path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost or any domain under your vercel.app account
    if (
      origin.includes('localhost') || 
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Root Route
app.get('/', (req, res) => {
  res.json({ message: "VELORA API is running smoothly 🚀" });
});

// Database Connection & Server Startup
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB 🚀");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })