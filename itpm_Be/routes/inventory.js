const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// Get all inventory items
router.get('/', async (req, res) => {
    try {
        const items = await Inventory.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single inventory item
router.get('/:id', async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new inventory item
router.post('/', async (req, res) => {
    const item = new Inventory({
        category: req.body.category,
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
        specs: req.body.specs,
        image: req.body.image,
        stock: req.body.stock,
        status: req.body.stock > 0 ? 'in-stock' : 'out-of-stock'
    });

    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update an inventory item
router.put('/:id', async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Update fields
        item.category = req.body.category || item.category;
        item.name = req.body.name || item.name;
        item.brand = req.body.brand || item.brand;
        item.price = req.body.price || item.price;
        item.specs = req.body.specs || item.specs;
        item.image = req.body.image || item.image;
        item.stock = req.body.stock || item.stock;
        item.status = req.body.stock > 0 ? 'in-stock' : 'out-of-stock';
        item.updatedAt = Date.now();

        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an inventory item
router.delete('/:id', async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        await item.deleteOne();
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 