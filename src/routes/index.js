const express = require('express');
const router = express.Router();

// Import individual route modules
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');

// Mount routes
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);

module.exports = router;