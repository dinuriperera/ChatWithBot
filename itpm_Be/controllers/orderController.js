const Cart = require('../models/Cart');

// Get all orders for a user
const getUserOrders = async (req, res) => {
    try {
        const orders = await Cart.find({
            userId: req.user._id,
            status: 'completed'
        }).sort({ updatedAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        console.log('Attempting to delete order:', orderId);

        // Check if order exists and belongs to user
        const order = await Cart.findOne({
            _id: orderId,
            userId: req.user._id,
            status: 'completed'  // Only allow deletion of completed orders
        });

        console.log('Found order:', order);

        if (!order) {
            console.log('Order not found or does not belong to user');
            return res.status(404).json({ 
                message: 'Order not found or you do not have permission to delete this order' 
            });
        }

        // Delete the order
        const deletedOrder = await Cart.findByIdAndDelete(orderId);
        console.log('Deleted order:', deletedOrder);

        if (!deletedOrder) {
            return res.status(500).json({ message: 'Failed to delete order' });
        }

        res.json({ message: 'Order deleted successfully', deletedOrder });
    } catch (error) {
        console.error('Error in deleteOrder:', error);
        res.status(500).json({ 
            message: 'Error deleting order', 
            error: error.message 
        });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body;

        const order = await Cart.findOneAndUpdate(
            {
                _id: orderId,
                userId: req.user._id
            },
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};

module.exports = {
    getUserOrders,
    deleteOrder,
    updateOrderStatus
}; 