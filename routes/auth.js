// ==================== AUTHENTICATION ROUTES ====================

import express from 'express';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword, generateToken, generateRefreshToken } from '../utils/helpers.js';
import { authenticateToken, asyncHandler } from '../middleware/auth.js';
import dotenv from 'dotenv';
import { dbType, models } from '../models/index.js';

dotenv.config();

const router = express.Router();
const { User } = models;

// ==================== REGISTER ====================

router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, first_name, last_name, phone } = req.body;

  // Validation
  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  // Check if user exists
  const existingUser = dbType === 'mongodb'
    ? await User.findOne({ email })
    : await User.findOne({ where: { email } });

  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  // Create new user
  const passwordHash = hashPassword(password);

  let newUser;
  if (dbType === 'mongodb') {
    newUser = new User({
      email,
      password_hash: passwordHash,
      first_name,
      last_name,
      phone
    });
    await newUser.save();
  } else {
    newUser = await User.create({
      email,
      password_hash: passwordHash,
      first_name,
      last_name,
      phone
    });
  }

  const accessToken = generateToken(newUser.id || newUser._id);
  const refreshToken = generateRefreshToken(newUser.id || newUser._id);

  res.status(201).json({
    message: 'User registered successfully',
    access_token: accessToken,
    refresh_token: refreshToken,
    user: {
      id: newUser.id || newUser._id,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name
    }
  });
}));

// ==================== SIGNUP (Alias for register) ====================

router.post('/signup', asyncHandler(async (req, res) => {
  const { email, password, first_name, last_name, phone } = req.body;

  // Validation
  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  // Check if user exists
  const existingUser = dbType === 'mongodb'
    ? await User.findOne({ email })
    : await User.findOne({ where: { email } });

  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  // Create new user
  const passwordHash = hashPassword(password);

  let newUser;
  if (dbType === 'mongodb') {
    newUser = new User({
      email,
      password_hash: passwordHash,
      first_name,
      last_name,
      phone
    });
    await newUser.save();
  } else {
    newUser = await User.create({
      email,
      password_hash: passwordHash,
      first_name,
      last_name,
      phone
    });
  }

  const accessToken = generateToken(newUser.id || newUser._id);
  const refreshToken = generateRefreshToken(newUser.id || newUser._id);

  res.status(201).json({
    message: 'User registered successfully',
    access_token: accessToken,
    refresh_token: refreshToken,
    user: {
      id: newUser.id || newUser._id,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name
    }
  });
}));

// ==================== LOGIN ====================

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  let user;
  if (dbType === 'mongodb') {
    user = await User.findOne({ email });
  } else {
    user = await User.findOne({ where: { email } });
  }

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isValidPassword = dbType === 'mongodb'
    ? user.comparePassword(password)
    : comparePassword(password, user.password_hash);

  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (dbType === 'mongodb' && !user.is_active) {
    return res.status(403).json({ message: 'Account is inactive' });
  }

  const accessToken = generateToken(user.id || user._id);
  const refreshToken = generateRefreshToken(user.id || user._id);

  res.json({
    message: 'Login successful',
    access_token: accessToken,
    refresh_token: refreshToken,
    user: {
      id: user.id || user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    }
  });
}));

// ==================== REFRESH TOKEN ====================

router.post('/refresh', asyncHandler(async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    res.json({
      access_token: newAccessToken,
      refresh_token: newRefreshToken
    });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
}));

// ==================== LOGOUT ====================

router.post('/logout', authenticateToken, (req, res) => {
  // Token invalidation logic can be implemented here with a blacklist
  res.json({ message: 'Logged out successfully' });
});

// ==================== VERIFY EMAIL ====================

router.post('/verify-email', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  if (dbType === 'mongodb') {
    await User.findByIdAndUpdate(userId, { is_verified: true });
  } else {
    await User.update({ is_verified: true }, { where: { id: userId } });
  }

  res.json({ message: 'Email verified successfully' });
}));

export default router;
