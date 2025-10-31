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

// CORS configuration - MEJORADA
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:1000',
  'https://full-stack-final-project-rauz.vercel.app',
  'https://ceramist-shop-backend.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite peticiones sin origin (Postman, apps móviles, etc.)
    // Y peticiones desde orígenes permitidos
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ Origen bloqueado por CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Aplicar CORS antes que cualquier otra cosa
app.use(cors(corsOptions));

// Handle preflight requests explícitamente
app.options('*', cors(corsOptions));

// Middleware adicional para asegurar headers CORS en todas las respuestas
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  
  // Log para debugging
  console.log(`📡 ${req.method} ${req.path} - Origin: ${origin || 'No origin'}`);
  
  next();
});

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cache static API responses for a short time
app.use((req, res, next) => {
  // Only cache GET requests
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=60, s-maxage=120');
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

// Health check route (útil para Vercel)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// 404 and error middlewares
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Allowed origins:`, allowedOrigins);
});

export default app;