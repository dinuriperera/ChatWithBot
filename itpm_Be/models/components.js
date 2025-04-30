const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['cpu', 'ram', 'ssd', 'gpu', 'motherboard', 'psu', 'case', 'cooling']
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
        required: true
    },
    specs: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Component', componentSchema); 