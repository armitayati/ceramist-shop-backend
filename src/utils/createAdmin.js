import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    process.exit(1);
  }
};

// Crear usuario administrador
const createAdmin = async () => {
  try {
    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ email: 'admin@ceramics.com' });
    
    if (existingAdmin) {
      console.log('⚠️  El usuario admin ya existe');
      console.log('Email:', existingAdmin.email);
      console.log('Rol:', existingAdmin.role);
      return;
    }

    // Crear nuevo admin
    const admin = await User.create({
      name: 'Admin Principal',
      email: 'admin@ceramics.com',
      password: 'admin123456', // Será encriptada automáticamente
      role: 'admin'
    });

    console.log('✅ Usuario administrador creado exitosamente!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123456');
    console.log('👤 Rol:', admin.role);
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login');
  } catch (error) {
    console.error('❌ Error al crear admin:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Desconectado de MongoDB');
  }
};

// Ejecutar script
const run = async () => {
  await connectDB();
  await createAdmin();
  process.exit(0);
};

run();