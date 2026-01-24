const express = require('express');
const Group = require('../models/Group');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create group
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, memberEmails } = req.body;

    // Create group with creator as first member
    const group = new Group({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id]
    });

    // Add additional members if provided
    if (memberEmails && memberEmails.length > 0) {
      const users = await User.find({ email: { $in: memberEmails } });
      const memberIds = users.map(u => u._id);
      
      // Add unique members only
      memberIds.forEach(id => {
        if (!group.members.includes(id)) {
          group.members.push(id);
        }
      });
    }

    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's groups
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('members', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single group
router.get('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is member
    if (!group.members.some(m => m._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add member to group
router.post('/:id/members', auth, async (req, res) => {
  try {
    const { email } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already member
    if (group.members.includes(user._id)) {
      return res.status(400).json({ message: 'User already in group' });
    }

    group.members.push(user._id);
    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate('members', 'name email');
    
    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;