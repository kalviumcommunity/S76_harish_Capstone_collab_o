const express = require('express');
const router = express.Router();
const Profile = require('../model/Profile');
const authenticate = require('../middleware/AuthMiddleWare');

// All routes that need req.user must have authenticate middleware!
router.get('/me', authenticate, async (req, res) => {
  // req.user is guaranteed to be set by authenticate middleware
  let profile = await Profile.findOne({ userId: req.user.id });
  if (!profile) profile = await Profile.create({ userId: req.user.id });
  res.json(profile);
});

router.put('/me', authenticate, async (req, res) => {
  const update = req.body;
  let profile = await Profile.findOneAndUpdate(
    { userId: req.user.id },
    update,
    { new: true, upsert: true }
  );
  res.json(profile);
});

router.post('/me', authenticate, async (req, res) => {
  try {
    const existing = await Profile.findOne({ userId: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'Profile already exists.' });
    }
    const profile = new Profile({ ...req.body, userId: req.user.id });
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating profile.' });
  }
});

module.exports = router;