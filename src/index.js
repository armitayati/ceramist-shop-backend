import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFound } from './middlewares/notFound.middleware.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://full-stack-final-project-rauz.vercel.app'
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cache static API responses for a short time
app.use((req, res, next) => {
  // Only cache GET requests
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=60, s-maxage=120');
    // max-age = 60 seconds for browsers
    // s-maxage = 120 seconds for CDNs (like Vercel Edge)
  } else {
    // Disable caching for non-GET requests
    res.set('Cache-Control', 'no-store');
  }
  next();
});
// Connect to MongoDB (after middleware setup)
connectDB();

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Ceramist Shop API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      admin: '/api/admin',
    },
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// 404 and error middlewares
app.use(notFound);
app.use(errorHandler);

export default app;