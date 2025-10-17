import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Esquema de Usuario
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres']
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email no válido']
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // Añade createdAt y updatedAt automáticamente
  }
);

// Middleware para encriptar contraseña antes de guardar
userSchema.pre('save', async function (next) {
  // Solo encriptar si la contraseña ha sido modificada
  if (!this.isModified('password')) {
    return next();
  }
  
  // Generar salt y encriptar
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Crear modelo
const User = mongoose.model('User', userSchema);

export default User;