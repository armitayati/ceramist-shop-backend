import express from 'express';
import {
  getAllUsers,
  getAllProductsAdmin,
  updateUserRole,
  toggleUserStatus,
  deleteProductAdmin,
  getStats
} from '../controllers/admin.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación y rol de admin
router.use(protect);
router.use(admin);

// Rutas de gestión de usuarios
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', toggleUserStatus);

// Rutas de gestión de productos
router.get('/products', getAllProductsAdmin);
router.delete('/products/:id', deleteProductAdmin);

// Estadísticas
router.get('/stats', getStats);

export default router;