const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  toggleProductField,
  deleteProduct
} = require('../controllers/productController');

// Create product
router.post('/create', createProduct);

// Get all products with filtering and sorting
router.get('/getAll', getAllProducts);

// Get one product by ID or slug
router.get('/getOne/:id', getProduct);

// Update product
router.put('/update/:id', updateProduct);

// Toggle boolean fields (isNewProduct, published, artistPick)
router.patch('/toggle/:id', toggleProductField);

// Delete product
router.delete('/delete/:id', deleteProduct);

module.exports = router; 