const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Create category
router.post('/create', createCategory);

// Get all categories
router.get('/getAll', getAllCategories);

// Get one category by ID or slug
router.get('/getOne/:id', getCategory);

// Update category
router.put('/update/:id', updateCategory);

// Delete category
router.delete('/delete/:id', deleteCategory);

module.exports = router; 