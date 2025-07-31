const mongoose = require('mongoose');
const InstagramPost = require('../models/InstagramPost');
const { deleteImageFromCloudinary } = require('../utils/cloudinaryUtils');

// Create Instagram post
const createInstagramPost = async (req, res) => {
  try {
    const { postName, image, postUrl, active } = req.body;
    
    const instagramPost = new InstagramPost({
      postName,
      image,
      postUrl,
      active: active || false
    });
    
    await instagramPost.save();
    
    res.status(201).json({
      success: true,
      data: instagramPost
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Fetch all Instagram posts
const getAllInstagramPosts = async (req, res) => {
  try {
    const { active, sort = 'createdAt', order = 'desc' } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (active !== undefined) {
      filter.active = active === 'true';
    }
    
    // Build sort object
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    
    const instagramPosts = await InstagramPost.find(filter).sort(sortOptions);
    
    res.status(200).json({
      success: true,
      count: instagramPosts.length,
      data: instagramPosts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Fetch one Instagram post by ID
const getInstagramPost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const instagramPost = await InstagramPost.findById(id);
    
    if (!instagramPost) {
      return res.status(404).json({
        success: false,
        error: 'Instagram post not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: instagramPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update Instagram post
const updateInstagramPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { postName, image, postUrl, active } = req.body;
    
    const instagramPost = await InstagramPost.findById(id);
    
    if (!instagramPost) {
      return res.status(404).json({
        success: false,
        error: 'Instagram post not found'
      });
    }
    
    // Delete old image if new image is provided
    if (image && instagramPost.image && image !== instagramPost.image) {
      await deleteImageFromCloudinary(instagramPost.image);
    }
    
    if (postName) instagramPost.postName = postName;
    if (image) instagramPost.image = image;
    if (postUrl) instagramPost.postUrl = postUrl;
    if (active !== undefined) instagramPost.active = active;
    
    await instagramPost.save();
    
    res.status(200).json({
      success: true,
      data: instagramPost
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Toggle Instagram post active status
const toggleInstagramPostActive = async (req, res) => {
  try {
    const { id } = req.params;
    
    const instagramPost = await InstagramPost.findById(id);
    
    if (!instagramPost) {
      return res.status(404).json({
        success: false,
        error: 'Instagram post not found'
      });
    }
    
    // Toggle the active status
    instagramPost.active = !instagramPost.active;
    await instagramPost.save();
    
    res.status(200).json({
      success: true,
      data: instagramPost
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete Instagram post
const deleteInstagramPost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const instagramPost = await InstagramPost.findByIdAndDelete(id);
    
    if (!instagramPost) {
      return res.status(404).json({
        success: false,
        error: 'Instagram post not found'
      });
    }
    
    // Delete associated image from Cloudinary
    if (instagramPost.image) {
      await deleteImageFromCloudinary(instagramPost.image);
    }
    
    res.status(200).json({
      success: true,
      message: 'Instagram post and associated image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createInstagramPost,
  getAllInstagramPosts,
  getInstagramPost,
  updateInstagramPost,
  toggleInstagramPostActive,
  deleteInstagramPost
}; 