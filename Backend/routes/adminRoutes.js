const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get all unapproved artisans
router.get('/unapproved-artisans', async (req, res) => {
  try {
    const artisans = await User.find({ role: 'artisan', isApproved: false });
    res.status(200).json(artisans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve artisan
router.patch('/approve-artisan/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject artisan (optional delete)
router.delete('/reject-artisan/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Artisan rejected and removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
