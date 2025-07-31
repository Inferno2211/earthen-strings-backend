const { deleteFile } = require('../services/cloudinaryService');

// Extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  try {
    // Handle different Cloudinary URL formats
    const cloudinaryRegex = /cloudinary\.com\/[^\/]+\/(?:image|video|raw)\/upload\/[^\/]+\/([^\/\?]+)/;
    const match = url.match(cloudinaryRegex);
    
    if (match && match[1]) {
      return match[1];
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

// Delete image from Cloudinary if it's a Cloudinary URL
const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return { success: true, message: 'No image URL provided' };
  
  const publicId = extractPublicIdFromUrl(imageUrl);
  
  if (!publicId) {
    return { success: true, message: 'Not a Cloudinary URL, skipping deletion' };
  }
  
  try {
    const result = await deleteFile(publicId, 'image');
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return { success: false, error: error.message };
  }
};

// Delete multiple images from Cloudinary
const deleteMultipleImagesFromCloudinary = async (imageUrls) => {
  if (!imageUrls || !Array.isArray(imageUrls)) {
    return { success: true, message: 'No images to delete' };
  }
  
  const results = [];
  
  for (const imageUrl of imageUrls) {
    const result = await deleteImageFromCloudinary(imageUrl);
    results.push(result);
  }
  
  return {
    success: true,
    message: `Processed ${imageUrls.length} images`,
    results
  };
};

module.exports = {
  extractPublicIdFromUrl,
  deleteImageFromCloudinary,
  deleteMultipleImagesFromCloudinary
}; 