const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    specs: {
        type: Object,
        required: true,
        default: {}
    },
    image: {
        type: String,
        default: ''
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['in-stock', 'out-of-stock'],
        default: 'in-stock'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Inventory', inventorySchema); 