const express = require('express');
const Expense = require('../models/Expense');
const Group = require('../models/Group');
const auth = require('../middleware/auth');
const { calculateBalances, optimizeSettlements } = require('../utils/settlement');

const router = express.Router();

// Add expense
router.post('/', auth, async (req, res) => {
  try {
    const { groupId, description, amount, participants } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Verify all participants are group members
    const invalidParticipants = participants.filter(
      p => !group.members.includes(p)
    );
    
    if (invalidParticipants.length > 0) {
      return res.status(400).json({ message: 'Some participants are not group members' });
    }

    // Create expense
    const expense = new Expense({
      group: groupId,
      description,
      amount,
      paidBy: req.user._id,
      participants,
      date: new Date()
    });

    await expense.save();

    const populatedExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name email')
      .populate('participants', 'name email');

    res.status(201).json(populatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get expenses for a group
router.get('/group/:groupId', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('paidBy', 'name email')
      .populate('participants', 'name email')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get balances for a group
router.get('/group/:groupId/balances', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('paidBy', 'name email')
      .populate('participants', 'name email');

    const balances = calculateBalances(expenses);

    // Convert to array with user details
    const group = await Group.findById(req.params.groupId).populate('members', 'name email');
    
    const balanceArray = group.members.map(member => ({
      user: {
        id: member._id,
        name: member.name,
        email: member.email
      },
      balance: Math.round((balances[member._id.toString()] || 0) * 100) / 100
    }));

    res.json(balanceArray);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get settlement recommendations for a group
router.get('/group/:groupId/settle', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('paidBy', 'name email')
      .populate('participants', 'name email');

    const balances = calculateBalances(expenses);
    const settlements = optimizeSettlements(balances);

    // Populate user details in settlements
    const group = await Group.findById(req.params.groupId).populate('members', 'name email');
    const membersMap = {};
    group.members.forEach(m => {
      membersMap[m._id.toString()] = { id: m._id, name: m.name, email: m.email };
    });

    const populatedSettlements = settlements.map(s => ({
      from: membersMap[s.from],
      to: membersMap[s.to],
      amount: s.amount
    }));

    res.json(populatedSettlements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Only the person who paid (created) the expense can delete it
    if (expense.paidBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    await expense.deleteOne();

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;