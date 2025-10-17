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

// Crear aplicación Express
const app = express();

// Definir puerto
const PORT = process.env.PORT || 5000;

// Conectar a la base de datos
connectDB();

// Middlewares globales
app.use(cors()); // Permitir peticiones desde cualquier origen (ajusta en producción)
app.use(express.json()); // Parsear JSON en el body
app.use(express.urlencoded({ extended: true })); // Parsear datos de formularios

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

// Rutas de la aplicación
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// Middlewares de error (deben ir al final)
app.use(notFound); // Manejo de rutas no encontradas (404)
app.use(errorHandler); // Manejo de errores del servidor (500)

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 API disponible en: http://localhost:${PORT}/api`);

});
