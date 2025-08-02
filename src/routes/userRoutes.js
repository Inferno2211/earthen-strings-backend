const express = require('express');
const router = express.Router();
const {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getDefaultAddress,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
} = require('../controllers/userController');
const { authenticateToken, requireUser, requireAdmin } = require('../middleware/auth');

// User routes (authenticated users)
router.get('/addresses', authenticateToken, getUserAddresses);
router.post('/addresses', authenticateToken, addAddress);
router.put('/addresses/:addressId', authenticateToken, updateAddress);
router.delete('/addresses/:addressId', authenticateToken, deleteAddress);
router.get('/addresses/default/:type', authenticateToken, getDefaultAddress);

// Admin routes
router.get('/admin/users', authenticateToken, requireAdmin, getAllUsers);
router.get('/admin/users/:userId', authenticateToken, requireAdmin, getUserById);
router.put('/admin/users/:userId', authenticateToken, requireAdmin, updateUserById);
router.delete('/admin/users/:userId', authenticateToken, requireAdmin, deleteUserById);

module.exports = router; 