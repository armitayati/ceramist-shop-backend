import mongoose from 'mongoose';

// Esquema de Producto (cerámica)
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres']
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      minlength: [10, 'La descripción debe tener al menos 10 caracteres']
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo']
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: ['jarrones', 'platos', 'tazas', 'cuencos', 'decoracion', 'otros'],
      default: 'otros'
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0
    },
    images: {
      type: [String],
      default: []
    },
    ceramist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El ceramista es obligatorio']
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    dimensions: {
      height: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      depth: { type: Number, default: 0 }
    },
    weight: {
      type: Number,
      default: 0
    },
    materials: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true // Añade createdAt y updatedAt automáticamente
  }
);

// Índices para mejorar búsquedas
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ ceramist: 1 });

// Crear modelo
const Product = mongoose.model('Product', productSchema);

export default Product;