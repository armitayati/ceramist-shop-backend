import Product from '../models/Product.model.js';

// @desc    Crear nuevo producto
// @route   POST /api/products
// @access  Private
export const createProduct = async (req, res) => {
  try {
    // Añadir el ID del ceramista (usuario autenticado)
    const productData = {
      ...req.body,
      ceramist: req.user.id
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Producto creado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message
    });
  }
};

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    // Filtros opcionales desde query params
    const { category, ceramist, isAvailable } = req.query;
    
    let filter = {};
    
    if (category) filter.category = category;
    if (ceramist) filter.ceramist = ceramist;
    if (isAvailable) filter.isAvailable = isAvailable === 'true';

    const products = await Product.find(filter)
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

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('ceramist', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error.message
    });
  }
};

// @desc    Actualizar producto
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Verificar que el producto pertenece al usuario autenticado
    if (product.ceramist.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar este producto'
      });
    }

    // Actualizar producto
    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: product,
      message: 'Producto actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
};

// @desc    Eliminar producto
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Verificar que el producto pertenece al usuario autenticado
    if (product.ceramist.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este producto'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};

// @desc    Obtener productos del usuario autenticado
// @route   GET /api/products/my-products
// @access  Private
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ ceramist: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener tus productos',
      error: error.message
    });
  }
};