const express = require('express');
const router = express.Router();
const componentModel = require('../models/components');

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

// Create a new component
router.post('/', async (req, res) => {
  try {
    const component = new componentModel(req.body);
    const savedComponent = await component.save();
    res.status(201).json(savedComponent);
  } catch (error) {
    console.error('Error creating component:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a component
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedComponent = await componentModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedComponent) {
      return res.status(404).json({ message: 'Component not found' });
    }
    res.json(updatedComponent);
  } catch (error) {
    console.error('Error updating component:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a component
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComponent = await componentModel.findByIdAndDelete(id);
    if (!deletedComponent) {
      return res.status(404).json({ message: 'Component not found' });
    }
    res.json({ message: 'Component deleted successfully' });
  } catch (error) {
    console.error('Error deleting component:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 