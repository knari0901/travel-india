// ==================== USER ROUTES ====================

import express from 'express';
import { authenticateToken, asyncHandler } from '../middleware/auth.js';
import dotenv from 'dotenv';
import { dbType, models } from '../models/index.js';

dotenv.config();

const router = express.Router();
const { User } = models;

// ==================== GET PROFILE ====================

router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  
  let user;
  if (dbType === 'mongodb') {
    user = await User.findById(userId).select('-password_hash');
  } else {
    user = await User.findByPk(userId);
  }
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({ user });
}));

// ==================== UPDATE PROFILE ====================

router.put('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { first_name, last_name, phone, bio, profile_picture } = req.body;
  
  const updateData = {};
  if (first_name) updateData.first_name = first_name;
  if (last_name) updateData.last_name = last_name;
  if (phone) updateData.phone = phone;
  if (bio) updateData.bio = bio;
  if (profile_picture) updateData.profile_picture = profile_picture;
  
  let user;
  if (dbType === 'mongodb') {
    user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password_hash');
  } else {
    await User.update(updateData, { where: { id: userId } });
    user = await User.findByPk(userId);
  }
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({
    message: 'Profile updated successfully',
    user
  });
}));

// ==================== CHANGE PASSWORD ====================

router.post('/change-password', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { current_password, new_password } = req.body;
  
  if (!current_password || !new_password) {
    return res.status(400).json({ message: 'Current and new password required' });
  }
  
  if (new_password.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }
  
  let user;
  if (dbType === 'mongodb') {
    user = await User.findById(userId);
    
    if (!user.comparePassword(current_password)) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    const bcrypt = await import('bcryptjs').then(m => m.default);
    user.password_hash = bcrypt.hashSync(new_password, 10);
    await user.save();
  } else {
    const { comparePassword, hashPassword } = await import('../utils/helpers.js');
    user = await User.findByPk(userId);
    
    if (!comparePassword(current_password, user.password_hash)) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    await user.update({ password_hash: hashPassword(new_password) });
  }
  
  res.json({ message: 'Password changed successfully' });
}));

// ==================== DELETE ACCOUNT ====================

router.delete('/account', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  
  if (dbType === 'mongodb') {
    await User.findByIdAndDelete(userId);
  } else {
    await User.destroy({ where: { id: userId } });
  }
  
  res.json({ message: 'Account deleted successfully' });
}));

// ==================== GET USER STATS ====================

router.get('/stats', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { Booking, Review } = models;
  
  const bookingsCount = dbType === 'mongodb'
    ? await Booking.countDocuments({ user_id: userId })
    : (await Booking.findAll({ where: { user_id: userId } })).length;
  
  const reviewsCount = dbType === 'mongodb'
    ? await Review.countDocuments({ user_id: userId })
    : (await Review.findAll({ where: { user_id: userId } })).length;
  
  res.json({
    total_bookings: bookingsCount,
    total_reviews: reviewsCount,
    member_since: new Date()
  });
}));

// ==================== GET ALL USERS (ADMIN) ====================

router.get('/admin/users', authenticateToken, asyncHandler(async (req, res) => {
  const { is_active, is_verified } = req.query;
  
  let query = {};
  if (is_active !== undefined) query.is_active = is_active === 'true';
  if (is_verified !== undefined) query.is_verified = is_verified === 'true';
  
  let users;
  if (dbType === 'mongodb') {
    users = await User.find(query).select('-password_hash').limit(100);
  } else {
    users = await User.findAll({
      where: query,
      limit: 100,
      attributes: { exclude: ['password_hash'] }
    });
  }
  
  res.json({
    users,
    total: users.length
  });
}));

export default router;
