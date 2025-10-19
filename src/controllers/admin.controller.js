import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
// @desc    Obtener todos los usuarios con conteo de productos
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Obtener conteo de productos para cada usuario
    const usersWithProductCount = await Promise.all(
      users.map(async (user) => {
        const productCount = await Product.countDocuments({ ceramist: user._id });
        return {
          ...user.toObject(),
          productCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithProductCount.length,
      data: usersWithProductCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

// @desc    Obtener todos los productos (de todos los usuarios)
// @route   GET /api/admin/products
// @access  Private/Admin
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('ceramist', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

// @desc    Actualizar rol de usuario
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rol no válido. Debe ser "user" o "admin"'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: `Rol actualizado a ${role}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar rol',
      error: error.message
    });
  }
};

// @desc    Activar/Desactivar usuario
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // No permitir desactivar al propio admin
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes desactivar tu propia cuenta'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: `Usuario ${user.isActive ? 'activado' : 'desactivado'}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cambiar estado del usuario',
      error: error.message
    });
  }
};

// @desc    Eliminar cualquier producto (admin)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProductAdmin = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Producto eliminado por el administrador'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};

// @desc    Obtener estadísticas del sistema
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalProducts = await Product.countDocuments();
    const availableProducts = await Product.countDocuments({ isAvailable: true });

    // Productos por categoría
    const productsByCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers
        },
        products: {
          total: totalProducts,
          available: availableProducts,
          unavailable: totalProducts - availableProducts
        },
        productsByCategory
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};