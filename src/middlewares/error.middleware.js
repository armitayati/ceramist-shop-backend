// Middleware para manejo de errores del servidor (500)
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.stack);

  // Error de Mongoose - ValidationError
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors
    });
  }

  // Error de Mongoose - CastError (ID no válido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID no válido'
    });
  }

  // Error de duplicado (código 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `El ${field} ya existe en la base de datos`
    });
  }

  // Error genérico del servidor
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
};