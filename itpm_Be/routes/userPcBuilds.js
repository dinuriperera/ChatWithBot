const express = require('express');
const router = express.Router();
const UserPcBuild = require('../models/userPcBuilds');
const auth = require('../middleware/auth');

// Get all PC builds for a user
router.get('/my-builds', auth, async (req, res) => {
    try {
        const builds = await UserPcBuild.find({ userId: req.user._id })
            .sort({ createdAt: -1 });
        res.json(builds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single PC build
router.get('/:id', auth, async (req, res) => {
    try {
        const build = await UserPcBuild.findOne({
            _id: req.params.id,
            userId: req.user._id
        });
        
        if (!build) {
            return res.status(404).json({ message: 'Build not found' });
        }
        
        res.json(build);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new PC build
router.post('/', auth, async (req, res) => {
    try {
        const build = new UserPcBuild({
            userId: req.user._id,
            buildName: req.body.buildName,
            buildDescription: req.body.buildDescription,
            components: req.body.components,
            totalPrice: req.body.totalPrice
        });

        const savedBuild = await build.save();
        res.status(201).json(savedBuild);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a PC build
router.put('/:id', auth, async (req, res) => {
    try {
        const build = await UserPcBuild.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!build) {
            return res.status(404).json({ message: 'Build not found' });
        }

        // Update fields
        build.buildName = req.body.buildName || build.buildName;
        build.buildDescription = req.body.buildDescription || build.buildDescription;
        build.components = req.body.components || build.components;
        build.totalPrice = req.body.totalPrice || build.totalPrice;
        build.status = req.body.status || build.status;
        build.updatedAt = Date.now();

        const updatedBuild = await build.save();
        res.json(updatedBuild);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a PC build
router.delete('/:id', auth, async (req, res) => {
    try {
        const build = await UserPcBuild.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!build) {
            return res.status(404).json({ message: 'Build not found' });
        }

        await build.deleteOne();
        res.json({ message: 'Build deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 