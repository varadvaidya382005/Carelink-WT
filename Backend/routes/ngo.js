const express = require('express');
const router = express.Router();
const NGO = require('../models/ngo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @route   POST /ngo/register
// @desc    Register a new NGO
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      ngoName,
      registrationNumber,
      president,
      responsibleMembers,
      totalMembers,
      strength,
      pastWorks,
      location
    } = req.body;

    // Check if NGO already exists
    let ngo = await NGO.findOne({ email });
    if (ngo) {
      return res.status(400).json({
        success: false,
        message: 'NGO with this email already exists'
      });
    }

    ngo = await NGO.findOne({ registrationNumber });
    if (ngo) {
      return res.status(400).json({
        success: false,
        message: 'NGO with this registration number already exists'
      });
    }

    // Create new NGO
    ngo = new NGO({
      email,
      password,
      ngoName,
      registrationNumber,
      president,
      responsibleMembers,
      totalMembers,
      strength,
      pastWorks,
      location,
      isApproved: false
    });

    await ngo.save();

    res.status(201).json({
      success: true,
      message: 'NGO registered successfully. Please wait for admin approval.'
    });
  } catch (error) {
    console.error('NGO registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /ngo/login
// @desc    Login NGO
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if NGO exists
    const ngo = await NGO.findOne({ email });
    if (!ngo) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if NGO is approved
    if (!ngo.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your NGO registration is pending approval'
      });
    }

    // Check password
    const isMatch = await ngo.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = jwt.sign(
      { id: ngo._id, type: 'ngo' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({
      success: true,
      message: 'Logged in successfully'
    });
  } catch (error) {
    console.error('NGO login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /ngo/pending
// @desc    Get all pending NGO registrations
// @access  Admin
router.get('/pending', async (req, res) => {
  try {
    const pendingNGOs = await NGO.find({ isApproved: false })
      .select('-password')
      .sort({ registeredAt: -1 });

    res.json({
      success: true,
      data: pendingNGOs
    });
  } catch (error) {
    console.error('Error fetching pending NGOs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pending NGOs'
    });
  }
});

// @route   PUT /ngo/:id/approve
// @desc    Approve or reject NGO registration
// @access  Admin
router.put('/:id/approve', async (req, res) => {
  try {
    const { approve } = req.body;
    const ngo = await NGO.findById(req.params.id);

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }

    ngo.isApproved = approve;
    await ngo.save();

    res.json({
      success: true,
      message: approve ? 'NGO approved successfully' : 'NGO rejected successfully'
    });
  } catch (error) {
    console.error('Error updating NGO approval status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating NGO status'
    });
  }
});

module.exports = router;