const mongoose = require('mongoose');
const Banner = require('../models/Banner');
const { deleteImageFromCloudinary } = require('../utils/cloudinaryUtils');

// Create banner
const createBanner = async (req, res) => {
  try {
    const { name, image, category, active, viewType } = req.body;
    
    const banner = new Banner({
      name,
      image,
      category,
      active: active || false,
      viewType: viewType || 'both'
    });
    
    await banner.save();
    
    // Populate category info
    await banner.populate('category', 'name slug image');
    
    res.status(201).json({
      success: true,
      data: banner
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Fetch all banners
const getAllBanners = async (req, res) => {
  try {
    const { active, viewType, sort = 'updatedAt', order = 'desc' } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (active !== undefined) {
      filter.active = active === 'true';
    }
    
    if (viewType) {
      // If viewType is specified, include banners that match or are 'both'
      filter.$or = [
        { viewType: viewType },
        { viewType: 'both' }
      ];
    }
    
    // Build sort object
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    
    const banners = await Banner.find(filter)
      .populate('category', 'name slug image')
      .sort(sortOptions);
    
    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Fetch one banner by ID
const getBanner = async (req, res) => {
  try {
    const { id } = req.params;
    
    const banner = await Banner.findById(id).populate('category', 'name slug image');
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update banner
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, category, active, viewType } = req.body;
    
    const banner = await Banner.findById(id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found'
      });
    }
    
    // Delete old image if new image is provided
    if (image && banner.image && image !== banner.image) {
      await deleteImageFromCloudinary(banner.image);
    }
    
    if (name) banner.name = name;
    if (image) banner.image = image;
    if (category) banner.category = category;
    if (active !== undefined) banner.active = active;
    if (viewType) banner.viewType = viewType;
    
    await banner.save();
    await banner.populate('category', 'name slug image');
    
    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Toggle banner active status
const toggleBannerActive = async (req, res) => {
  try {
    const { id } = req.params;
    
    const banner = await Banner.findById(id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found'
      });
    }
    
    // Toggle the active status
    banner.active = !banner.active;
    await banner.save();
    await banner.populate('category', 'name slug image');
    
    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete banner
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    
    const banner = await Banner.findByIdAndDelete(id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found'
      });
    }
    
    // Delete associated image from Cloudinary
    if (banner.image) {
      await deleteImageFromCloudinary(banner.image);
    }
    
    res.status(200).json({
      success: true,
      message: 'Banner and associated image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createBanner,
  getAllBanners,
  getBanner,
  updateBanner,
  toggleBannerActive,
  deleteBanner
}; 