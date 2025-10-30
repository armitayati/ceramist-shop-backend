/**
 * Optimiza URLs de Cloudinary para mejor rendimiento
 * @param {string} url - URL original de la imagen
 * @param {object} options - Opciones de transformación
 * @returns {string} URL optimizada
 */
export const optimizeCloudinaryUrl = (url, options = {}) => {
  // Si no es una URL de Cloudinary, devolver sin cambios
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const {
    width = 600,
    height = 450,
    quality = 'auto:good',
    format = 'auto',
    crop = 'fill'
  } = options;

  // Construir transformaciones
  const transformations = [
    `f_${format}`,        // Formato auto (WebP si el navegador lo soporta)
    `q_${quality}`,       // Calidad automática
    `w_${width}`,         // Ancho
    `h_${height}`,        // Alto
    `c_${crop}`,          // Crop/fill
    'dpr_auto',           // DPR automático para retina displays
  ].join(',');

  // Reemplazar /upload/ con /upload/transformaciones/
  return url.replace('/upload/', `/upload/${transformations}/`);
};

/**
 * Optimiza URLs para diferentes tamaños
 */
export const getResponsiveImageUrls = (url) => {
  return {
    small: optimizeCloudinaryUrl(url, { width: 400, height: 300 }),
    medium: optimizeCloudinaryUrl(url, { width: 600, height: 450 }),
    large: optimizeCloudinaryUrl(url, { width: 800, height: 600 }),
  };
};