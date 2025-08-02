const express = require('express');
const router = express.Router();

// Import individual route modules
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const bannerRoutes = require('./bannerRoutes');
const instagramPostRoutes = require('./instagramPostRoutes');
const uploadRoutes = require('./uploadRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const wishlistRoutes = require('./wishlistRoutes');

// Mount routes
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/banners', bannerRoutes);
router.use('/instagram-posts', instagramPostRoutes);
router.use('/upload', uploadRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/wishlist', wishlistRoutes);

module.exports = router;