const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategorizedProducts
} = require('../controllers/categoryController');

// Create category
router.post('/create', createCategory);

// Get all categories
router.get('/getAll', getAllCategories);

// Get products by category group (tableware, accessories, wall-decor, or specific category)
router.get('/products/:category', getCategorizedProducts);

// Get one category by ID or slug
router.get('/getOne/:id', getCategory);

// Update category
router.put('/update/:id', updateCategory);

// Delete category
router.delete('/delete/:id', deleteCategory);

module.exports = router; 