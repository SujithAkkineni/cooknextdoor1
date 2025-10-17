const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role, location } = req.body;

  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Demo mode: Create mock user response
      const mockUser = {
        id: 'demo_' + Date.now(),
        name,
        email,
        role: role || 'buyer',
        location: location || 'Demo Location'
      };

      const payload = { user: { id: mockUser.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });

      return res.json({
        token,
        user: mockUser,
        demo: true,
        message: 'Running in demo mode - no database connected'
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ name, email, password, role, location });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Demo mode: Allow any login for demo purposes
      const mockUser = {
        id: 'demo_' + Date.now(),
        name: email.split('@')[0],
        email,
        role: 'buyer', // Default role for demo
        location: 'Demo Location'
      };

      const payload = { user: { id: mockUser.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });

      return res.json({
        token,
        user: mockUser,
        demo: true,
        message: 'Demo mode login successful'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
