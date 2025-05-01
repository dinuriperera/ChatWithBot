const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserOrders, deleteOrder, updateOrderStatus } = require('../controllers/orderController');

// Get user's orders
router.get('/', auth, getUserOrders);

// Delete an order
router.delete('/:orderId', auth, deleteOrder);

// Update order status
router.put('/:orderId', auth, updateOrderStatus);

module.exports = router; 