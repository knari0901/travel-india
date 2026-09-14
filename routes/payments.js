// ==================== PAYMENT ROUTES ====================

import express from 'express';
import { authenticateToken, asyncHandler } from '../middleware/auth.js';
import dotenv from 'dotenv';
import { dbType, models } from '../models/index.js';

dotenv.config();

const router = express.Router();
const { Payment, Booking } = models;

// ==================== CREATE PAYMENT INTENT ====================

router.post('/create-intent', authenticateToken, asyncHandler(async (req, res) => {
  const { booking_id, payment_method } = req.body;
  const userId = req.user.userId;
  
  // Validate booking
  let booking;
  if (dbType === 'mongodb') {
    booking = await Booking.findById(booking_id);
  } else {
    booking = await Booking.findByPk(booking_id);
  }
  
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  
  if (booking.user_id.toString() !== userId && booking.user_id !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  
  // TODO: Integrate with Stripe
  // For now, create a local payment record
  let payment;
  if (dbType === 'mongodb') {
    payment = new Payment({
      booking_id,
      amount: booking.total_price,
      payment_method: payment_method || 'credit_card',
      status: 'pending'
    });
    await payment.save();
  } else {
    payment = await Payment.create({
      booking_id,
      amount: booking.total_price,
      payment_method: payment_method || 'credit_card',
      status: 'pending'
    });
  }
  
  res.status(201).json({
    message: 'Payment intent created',
    payment,
    client_secret: 'test_secret_' + payment.id // Mock for demo
  });
}));

// ==================== CONFIRM PAYMENT ====================

router.post('/:id/confirm', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  let payment;
  if (dbType === 'mongodb') {
    payment = await Payment.findById(id).populate('booking_id');
  } else {
    payment = await Payment.findByPk(id, { include: ['booking_id'] });
  }
  
  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  const paymentBookingId = dbType === 'mongodb' ? payment.booking_id._id : payment.booking_id;
  let booking = dbType === 'mongodb'
    ? await Booking.findById(paymentBookingId)
    : await Booking.findByPk(paymentBookingId);

  if (!booking || (booking.user_id.toString() !== req.user.userId && booking.user_id !== req.user.userId)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  
  if (dbType === 'mongodb') {
    payment.status = 'completed';
    await payment.save();
    
    // Update booking status
    if (booking) {
      booking.status = 'confirmed';
      await booking.save();
    }
  } else {
    await payment.update({ status: 'completed' });
    
    if (booking) {
      await booking.update({ status: 'confirmed' });
    }
  }

  if (dbType === 'mongodb') {
    await booking.populate(['user_id', 'destination_id']);
  } else {
    booking = await Booking.findByPk(payment.booking_id, { include: ['user_id', 'destination_id'] });
  }
  
  res.json({
    message: 'Payment confirmed successfully',
    payment,
    booking
  });
}));

// ==================== GET PAYMENT ====================

router.get('/:booking_id', authenticateToken, asyncHandler(async (req, res) => {
  const { booking_id } = req.params;
  
  let payment;
  if (dbType === 'mongodb') {
    payment = await Payment.findOne({ booking_id });
  } else {
    payment = await Payment.findOne({ where: { booking_id } });
  }
  
  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }
  
  res.json({ payment });
}));

// ==================== REFUND PAYMENT ====================

router.post('/:id/refund', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  let payment;
  if (dbType === 'mongodb') {
    payment = await Payment.findById(id);
  } else {
    payment = await Payment.findByPk(id);
  }
  
  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }
  
  if (payment.status !== 'completed') {
    return res.status(400).json({ message: 'Only completed payments can be refunded' });
  }
  
  if (dbType === 'mongodb') {
    payment.status = 'refunded';
    await payment.save();
  } else {
    await payment.update({ status: 'refunded' });
  }
  
  res.json({
    message: 'Payment refunded successfully',
    payment
  });
}));

// ==================== GET ALL PAYMENTS (ADMIN) ====================

router.get('/admin/all', authenticateToken, asyncHandler(async (req, res) => {
  const { status, payment_method } = req.query;
  
  let query = {};
  if (status) query.status = status;
  if (payment_method) query.payment_method = payment_method;
  
  let payments;
  if (dbType === 'mongodb') {
    payments = await Payment.find(query).populate('booking_id').sort({ created_at: -1 });
  } else {
    payments = await Payment.findAll({
      where: query,
      include: ['booking_id'],
      order: [['created_at', 'DESC']]
    });
  }
  
  res.json({
    payments,
    total: payments.length
  });
}));

export default router;
