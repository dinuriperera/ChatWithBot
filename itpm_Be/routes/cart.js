const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Get user's cart
router.get('/', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ 
            userId: req.user._id,
            status: 'active'
        });
        res.json(cart || { items: [], totalAmount: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ 
            userId: req.user._id,
            status: 'active'
        });

        if (!cart) {
            cart = new Cart({
                userId: req.user._id,
                items: [],
                totalAmount: 0,
                status: 'active'
            });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.productId.toString() === req.body.productId
        );

        if (itemIndex > -1) {
            // Item exists, update quantity
            cart.items[itemIndex].quantity += req.body.quantity;
        } else {
            // Add new item
            cart.items.push({
                productId: req.body.productId,
                name: req.body.name,
                price: req.body.price,
                image: req.body.image,
                category: req.body.category,
                specs: req.body.specs,
                quantity: req.body.quantity
            });
        }

        // Calculate total amount
        cart.totalAmount = cart.items.reduce((total, item) => 
            total + (item.price * item.quantity), 0
        );

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update cart item quantity
router.put('/update/:itemId', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.user._id,
            status: 'active'
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => 
            item._id.toString() === req.params.itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items[itemIndex].quantity = req.body.quantity;
        cart.totalAmount = cart.items.reduce((total, item) => 
            total + (item.price * item.quantity), 0
        );

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Remove item from cart
router.delete('/remove/:itemId', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.user._id,
            status: 'active'
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => 
            item._id.toString() !== req.params.itemId
        );

        cart.totalAmount = cart.items.reduce((total, item) => 
            total + (item.price * item.quantity), 0
        );

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.user._id,
            status: 'active'
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();
        
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update cart status
router.put('/status', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.user._id,
            status: 'active'
        });

        if (!cart) {
            return res.status(404).json({ message: 'No active cart found' });
        }

        cart.status = req.body.status;
        await cart.save();
        
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get saved orders
router.get('/orders', auth, async (req, res) => {
    try {
        const orders = await Cart.find({
            userId: req.user._id,
            status: 'completed'
        }).sort({ updatedAt: -1 });

        // Transform the data to match the frontend format
        const transformedOrders = orders.map(order => {
            // Get the first item from the cart as the main product
            const mainProduct = order.items[0] || {};
            
            return {
                _id: order._id,
                date: order.createdAt,
                product: {
                    ...mainProduct,
                    name: mainProduct.name || 'Unknown Product',
                    price: mainProduct.price || 0,
                    quantity: mainProduct.quantity || 1,
                    image: mainProduct.image || '',
                    category: mainProduct.category || 'Uncategorized'
                },
                status: order.status,
                total: order.totalAmount
            };
        });

        console.log('Transformed orders:', transformedOrders);
        res.json(transformedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(400).json({ message: error.message });
    }
});

// Delete a completed order
router.delete('/:orderId', auth, async (req, res) => {
    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
            return res.status(400).json({ 
                message: 'Invalid order ID format' 
            });
        }

        const order = await Cart.findOne({
            _id: req.params.orderId,
            userId: req.user._id,
            status: 'completed'
        });

        if (!order) {
            return res.status(404).json({ 
                message: 'Order not found or you do not have permission to delete this order' 
            });
        }

        const deletedOrder = await Cart.findByIdAndDelete(req.params.orderId);
        
        if (!deletedOrder) {
            return res.status(500).json({ message: 'Failed to delete order' });
        }

        res.json({ message: 'Order deleted successfully', deletedOrder });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: error.message });
    }
});

// Update user note for an order
router.put('/:orderId/note', auth, async (req, res) => {
    try {
        const { userNote } = req.body;
        
        const order = await Cart.findOne({
            _id: req.params.orderId,
            userId: req.user._id,
            status: 'completed'
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found or you do not have permission to update this order' });
        }

        order.userNote = userNote;
        await order.save();
        
        res.json(order);
    } catch (error) {
        console.error('Error updating order note:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 