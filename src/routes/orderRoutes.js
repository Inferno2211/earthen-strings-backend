const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getAllOrders,
  getOrderByIdAdmin
} = require('../controllers/orderController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// User routes (authenticated users)
router.use(authenticateToken);

// Create order from cart
router.post('/create', createOrder);

// Get user's orders
router.get('/my-orders', getUserOrders);

// Get specific order
router.get('/:orderId', getOrderById);

// Cancel order
router.put('/:orderId/cancel', cancelOrder);

// Update payment status
router.put('/:orderId/payment', updatePaymentStatus);

// Admin routes
router.get('/admin/all', requireAdmin, getAllOrders);
router.get('/admin/:orderId', requireAdmin, getOrderByIdAdmin);
router.put('/admin/:orderId/status', requireAdmin, updateOrderStatus);

module.exports = router; 