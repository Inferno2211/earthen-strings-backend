const express = require('express');
const router = express.Router();
const {
  createBanner,
  getAllBanners,
  getBanner,
  updateBanner,
  toggleBannerActive,
  deleteBanner
} = require('../controllers/bannerController');

// Create banner
router.post('/create', createBanner);

// Get all banners with filtering and sorting
router.get('/getAll', getAllBanners);

// Get one banner by ID
router.get('/getOne/:id', getBanner);

// Update banner
router.put('/update/:id', updateBanner);

// Toggle banner active status
router.patch('/toggle/:id', toggleBannerActive);

// Delete banner
router.delete('/delete/:id', deleteBanner);

module.exports = router; 