const express = require('express');
const router = express.Router();
const {
  createInstagramPost,
  getAllInstagramPosts,
  getInstagramPost,
  updateInstagramPost,
  toggleInstagramPostActive,
  deleteInstagramPost
} = require('../controllers/instagramPostController');

// Create Instagram post
router.post('/create', createInstagramPost);

// Get all Instagram posts with filtering and sorting
router.get('/getAll', getAllInstagramPosts);

// Get one Instagram post by ID
router.get('/getOne/:id', getInstagramPost);

// Update Instagram post
router.put('/update/:id', updateInstagramPost);

// Toggle Instagram post active status
router.patch('/toggle/:id', toggleInstagramPostActive);

// Delete Instagram post
router.delete('/delete/:id', deleteInstagramPost);

module.exports = router; 