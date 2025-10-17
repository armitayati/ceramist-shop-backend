import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

// Middleware para proteger rutas (requiere autenticación)
export const protect = async (req, res, next) => {
  let token;

  // Verificar si existe el token en los headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario del token (sin password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      next();
    } catch (error) {
      console.error('Error en autenticación:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Token no válido o expirado'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado, no se proporcionó token'
    });
  }
};

// Middleware para verificar rol de administrador
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de administrador'
    });
  }
};