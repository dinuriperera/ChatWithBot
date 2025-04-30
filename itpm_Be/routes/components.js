const express = require('express');
const router = express.Router();
const componentModel = require('../models/components');

// Get components by category
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const components = await componentModel.find({ category });
    res.json(components);
  } catch (error) {
    console.error('Error fetching components:', error);
    res.status(500).json({ message: 'Error fetching components' });
  }
});

// Get all components
router.get('/', async (req, res) => {
  try {
    const components = await componentModel.find();
    res.json(components);
  } catch (error) {
    console.error('Error fetching components:', error);
    res.status(500).json({ message: 'Error fetching components' });
  }
});

// Create a new component
router.post('/', async (req, res) => {
  try {
    const component = new componentModel(req.body);
    const savedComponent = await component.save();
    res.status(201).json(savedComponent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 