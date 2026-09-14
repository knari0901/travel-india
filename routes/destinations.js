// ==================== DESTINATION ROUTES ====================

import express from 'express';
import { Op } from 'sequelize';
import { authenticateToken, asyncHandler } from '../middleware/auth.js';
import dotenv from 'dotenv';
import { dbType, models } from '../models/index.js';

dotenv.config();

const router = express.Router();
const { Destination } = models;

// ==================== GET ALL DESTINATIONS ====================

router.get('/', asyncHandler(async (req, res) => {
  const { state, min_price, max_price, search } = req.query;
  
  let query = {};
  
  if (dbType === 'mongodb') {
    if (state) query.state = state;
    if (min_price || max_price) {
      query.price_per_night = {};
      if (min_price) query.price_per_night.$gte = parseFloat(min_price);
      if (max_price) query.price_per_night.$lte = parseFloat(max_price);
    }
    if (search) query.name = { $regex: search, $options: 'i' };
    
    const destinations = await Destination.find(query).limit(50);
    return res.json({
      destinations,
      total: destinations.length
    });
  } else {
    const where = { is_available: true };
    if (state) where.state = state;
    if (min_price || max_price) {
      where.price_per_night = {};
      if (min_price) where.price_per_night[Op.gte] = parseFloat(min_price);
      if (max_price) where.price_per_night[Op.lte] = parseFloat(max_price);
    }
    
    const destinations = await Destination.findAll({ where, limit: 50 });
    return res.json({
      destinations,
      total: destinations.length
    });
  }
}));

// ==================== GET SINGLE DESTINATION ====================

router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  let destination;
  if (dbType === 'mongodb') {
    destination = await Destination.findById(id);
  } else {
    destination = await Destination.findByPk(id);
  }
  
  if (!destination) {
    return res.status(404).json({ message: 'Destination not found' });
  }
  
  res.json({ destination });
}));

// ==================== CREATE DESTINATION (ADMIN) ====================

router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const { name, description, state, price_per_night, max_guests, image_url, amenities } = req.body;
  
  // Validation
  if (!name || !description || !state || !price_per_night) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  // Check if exists
  const existing = dbType === 'mongodb'
    ? await Destination.findOne({ name })
    : await Destination.findOne({ where: { name } });
  
  if (existing) {
    return res.status(409).json({ message: 'Destination already exists' });
  }
  
  let destination;
  if (dbType === 'mongodb') {
    destination = new Destination({
      name,
      description,
      state,
      price_per_night,
      max_guests: max_guests || 4,
      image_url,
      amenities: amenities || []
    });
    await destination.save();
  } else {
    destination = await Destination.create({
      name,
      description,
      state,
      price_per_night,
      max_guests: max_guests || 4,
      image_url,
      amenities
    });
  }
  
  res.status(201).json({
    message: 'Destination created successfully',
    destination
  });
}));

// ==================== UPDATE DESTINATION ====================

router.put('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  let destination;
  if (dbType === 'mongodb') {
    destination = await Destination.findByIdAndUpdate(id, updateData, { new: true });
  } else {
    await Destination.update(updateData, { where: { id } });
    destination = await Destination.findByPk(id);
  }
  
  if (!destination) {
    return res.status(404).json({ message: 'Destination not found' });
  }
  
  res.json({
    message: 'Destination updated successfully',
    destination
  });
}));

// ==================== DELETE DESTINATION ====================

router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  let result;
  if (dbType === 'mongodb') {
    result = await Destination.findByIdAndDelete(id);
  } else {
    await Destination.destroy({ where: { id } });
    result = { id };
  }
  
  if (!result) {
    return res.status(404).json({ message: 'Destination not found' });
  }
  
  res.json({ message: 'Destination deleted successfully' });
}));

export default router;
