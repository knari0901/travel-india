// ==================== REVIEW ROUTES ====================

import express from 'express';
import { authenticateToken, asyncHandler } from '../middleware/auth.js';
import dotenv from 'dotenv';
import { dbType, models } from '../models/index.js';

dotenv.config();

const router = express.Router();
const { Review, User, Destination, Booking } = models;

// ==================== CREATE REVIEW ====================

router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { destination_id, rating, title, comment, photos } = req.body;
  
  // Validation
  if (!destination_id || !rating || !title) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }
  
  // Check if user has booked this destination
  let hasBooked;
  if (dbType === 'mongodb') {
    hasBooked = await Booking.findOne({
      user_id: userId,
      destination_id
    });
  } else {
    hasBooked = await Booking.findOne({
      where: { user_id: userId, destination_id }
    });
  }
  
  if (!hasBooked) {
    return res.status(400).json({ message: 'You can only review destinations you have booked' });
  }
  
  // Create review
  let review;
  if (dbType === 'mongodb') {
    review = new Review({
      user_id: userId,
      destination_id,
      rating,
      title,
      comment,
      photos: photos || []
    });
    await review.save();
    await review.populate(['user_id', 'destination_id']);
  } else {
    review = await Review.create({
      user_id: userId,
      destination_id,
      rating,
      title,
      comment,
      photos
    });
  }
  
  res.status(201).json({
    message: 'Review created successfully',
    review
  });
}));

// ==================== GET DESTINATION REVIEWS ====================

router.get('/destination/:destination_id', asyncHandler(async (req, res) => {
  const { destination_id } = req.params;
  const { limit = 10, offset = 0 } = req.query;
  
  let reviews;
  if (dbType === 'mongodb') {
    reviews = await Review.find({ destination_id })
      .populate('user_id')
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
  } else {
    reviews = await Review.findAll({
      where: { destination_id },
      include: ['user_id'],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  }
  
  // Calculate average rating
  let totalRating = 0;
  reviews.forEach(r => totalRating += r.rating);
  const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : 0;
  
  res.json({
    reviews,
    average_rating: averageRating,
    total: reviews.length
  });
}));

// ==================== GET USER REVIEWS ====================

router.get('/user', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  
  let reviews;
  if (dbType === 'mongodb') {
    reviews = await Review.find({ user_id: userId })
      .populate('destination_id')
      .sort({ created_at: -1 });
  } else {
    reviews = await Review.findAll({
      where: { user_id: userId },
      include: ['destination_id'],
      order: [['created_at', 'DESC']]
    });
  }
  
  res.json({
    reviews,
    total: reviews.length
  });
}));

// ==================== UPDATE REVIEW ====================

router.put('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { rating, title, comment, photos } = req.body;
  
  let review;
  if (dbType === 'mongodb') {
    review = await Review.findById(id);
  } else {
    review = await Review.findByPk(id);
  }
  
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }
  
  if (review.user_id.toString() !== userId && review.user_id !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  
  const updateData = {};
  if (rating !== undefined) {
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    updateData.rating = rating;
  }
  if (title !== undefined) updateData.title = title;
  if (comment !== undefined) updateData.comment = comment;
  if (photos !== undefined) updateData.photos = photos;
  
  if (dbType === 'mongodb') {
    Object.assign(review, updateData);
    await review.save();
  } else {
    await review.update(updateData);
  }
  
  res.json({
    message: 'Review updated successfully',
    review
  });
}));

// ==================== DELETE REVIEW ====================

router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  
  let review;
  if (dbType === 'mongodb') {
    review = await Review.findById(id);
  } else {
    review = await Review.findByPk(id);
  }
  
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }
  
  if (review.user_id.toString() !== userId && review.user_id !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  
  if (dbType === 'mongodb') {
    await Review.findByIdAndDelete(id);
  } else {
    await Review.destroy({ where: { id } });
  }
  
  res.json({ message: 'Review deleted successfully' });
}));

// ==================== LIKE REVIEW ====================

router.post('/:id/like', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  let review;
  if (dbType === 'mongodb') {
    review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpful_count: 1 } },
      { new: true }
    );
  } else {
    const review = await Review.findByPk(id);
    await review.increment('helpful_count');
  }
  
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }
  
  res.json({
    message: 'Review liked',
    review
  });
}));

export default router;
