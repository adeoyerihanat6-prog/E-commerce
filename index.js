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
  origin: ['https://your-vercel-app-name.vercel.app', 'http://localhost:5173'],
  credentials: true
})); // Enables cross-origin requests from your React frontend
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Root Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Database Connection & Server Startup
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB 🚀");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });