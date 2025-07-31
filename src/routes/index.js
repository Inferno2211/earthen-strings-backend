const express = require('express');
const router = express.Router();

// Import individual route modules
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const bannerRoutes = require('./bannerRoutes');
const instagramPostRoutes = require('./instagramPostRoutes');
const uploadRoutes = require('./uploadRoutes');

// Mount routes
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/banners', bannerRoutes);
router.use('/instagram-posts', instagramPostRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;