import mongoose from 'mongoose';

// Función para conectar a MongoDB
export const connectDB = async () => {
  try {
    // Conectar usando la URL del archivo .env
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📦 Base de datos: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Error al conectar MongoDB: ${error.message}`);
    process.exit(1); // Salir del proceso si falla la conexión
  }
};