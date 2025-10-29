import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFound } from './middlewares/notFound.middleware.js';

// Configurar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Crear aplicación Express
const app = express();

// Middlewares globales
const allowedOrigins = [
  'http://localhost:5173',
  'https://full-stack-final-project-rauz.vercel.app'
];

app.use(cors({
  origin: '*', // Allow any origin (for testing)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'Ceramist Shop API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      admin: '/api/admin'
    }
  });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// Middlewares de error
app.use(notFound);
app.use(errorHandler);


export default app;
