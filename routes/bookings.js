// ==================== BOOKING ROUTES ====================

import express from 'express';
import { authenticateToken, asyncHandler } from '../middleware/auth.js';
import { calculateNights, calculateTotalPrice } from '../utils/helpers.js';
import dotenv from 'dotenv';
import { dbType, models } from '../models/index.js';

dotenv.config();

const router = express.Router();
const { Booking, Destination } = models;

// ==================== CREATE BOOKING ====================

router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { destination_id, check_in_date, check_out_date, num_guests, special_requests } = req.body;
  
  // Validation
  if (!destination_id || !check_in_date || !check_out_date || !num_guests) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  const checkIn = new Date(check_in_date);
  const checkOut = new Date(check_out_date);
  
  if (checkIn >= checkOut) {
    return res.status(400).json({ message: 'Invalid dates: check-out must be after check-in' });
  }
  
  // Get destination
  let destination;
  if (dbType === 'mongodb') {
    destination = await Destination.findById(destination_id);
  } else {
    destination = await Destination.findByPk(destination_id);
  }
  
  if (!destination) {
    return res.status(404).json({ message: 'Destination not found' });
  }
  
  if (num_guests > destination.max_guests) {
    return res.status(400).json({ message: `Maximum guests is ${destination.max_guests}` });
  }
  
  // Calculate price
  const nights = calculateNights(checkIn, checkOut);
  const totalPrice = calculateTotalPrice(destination.price_per_night, nights);
  
  // Create booking
  let booking;
  if (dbType === 'mongodb') {
    booking = new Booking({
      user_id: userId,
      destination_id,
      check_in_date: checkIn,
      check_out_date: checkOut,
      num_guests,
      total_price: totalPrice,
      special_requests
    });
    await booking.save();
    await booking.populate(['user_id', 'destination_id']);
  } else {
    booking = await Booking.create({
      user_id: userId,
      destination_id,
      check_in_date: checkIn,
      check_out_date: checkOut,
      num_guests,
      total_price: totalPrice,
      special_requests
    });
  }
  
  res.status(201).json({
    message: 'Booking created successfully',
    booking,
    nights,
    total_price: totalPrice
  });
}));

// ==================== GET USER BOOKINGS ====================

router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  
  let bookings;
  if (dbType === 'mongodb') {
    bookings = await Booking.find({ user_id: userId })
      .populate('destination_id')
      .sort({ created_at: -1 });
  } else {
    bookings = await Booking.findAll({
      where: { user_id: userId },
      include: ['destination_id'],
      order: [['created_at', 'DESC']]
    });
  }
  
  res.json({
    bookings,
    total: bookings.length
  });
}));

// ==================== GET BOOKING DETAILS ====================

router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  
  let booking;
  if (dbType === 'mongodb') {
    booking = await Booking.findById(id).populate(['user_id', 'destination_id']);
  } else {
    booking = await Booking.findByPk(id, { include: ['user_id', 'destination_id'] });
  }
  
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  
  if (booking.user_id.toString() !== userId && booking.user_id !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  
  res.json({ booking });
}));

// ==================== CANCEL BOOKING ====================

router.post('/:id/cancel', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  
  let booking;
  if (dbType === 'mongodb') {
    booking = await Booking.findById(id);
  } else {
    booking = await Booking.findByPk(id);
  }
  
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  
  if (booking.user_id.toString() !== userId && booking.user_id !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  
  if (booking.status === 'cancelled') {
    return res.status(400).json({ message: 'Booking already cancelled' });
  }
  
  if (dbType === 'mongodb') {
    booking.status = 'cancelled';
    await booking.save();
  } else {
    await booking.update({ status: 'cancelled' });
  }
  
  res.json({ message: 'Booking cancelled successfully', booking });
}));

// ==================== UPDATE BOOKING ====================

router.put('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const updateData = req.body;
  
  let booking;
  if (dbType === 'mongodb') {
    booking = await Booking.findById(id);
  } else {
    booking = await Booking.findByPk(id);
  }
  
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  
  if (booking.user_id.toString() !== userId && booking.user_id !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  
  if (dbType === 'mongodb') {
    Object.assign(booking, updateData);
    await booking.save();
  } else {
    await booking.update(updateData);
  }
  
  res.json({ message: 'Booking updated successfully', booking });
}));

export default router;
