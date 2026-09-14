// scripts/initDatabase.js
// Initialize database with sample data

import dotenv from 'dotenv';
import { dbType, models } from '../models/index.js';

dotenv.config();

const initDatabase = async () => {
  try {
    console.log('Starting database initialization...');
    console.log(`Database Type: ${dbType}`);

    const { Destination } = models;
    const destinations = [
      {
        name: 'Taj Mahal, Agra',
        description: 'Experience the timeless beauty of the Taj Mahal, one of the Seven Wonders of the World',
        state: 'Uttar Pradesh',
        price_per_night: 5000,
        max_guests: 4,
        amenities: ['WiFi', 'AC', 'Breakfast', '24/7 Service'],
        image_url: 'https://via.placeholder.com/400x300?text=Taj+Mahal',
        is_available: true
      },
      {
        name: 'Kerala Backwaters',
        description: 'Cruise through the serene backwaters of Kerala on traditional houseboats',
        state: 'Kerala',
        price_per_night: 4500,
        max_guests: 6,
        amenities: ['Houseboat', 'Meals', 'WiFi', 'Air Conditioning'],
        image_url: 'https://via.placeholder.com/400x300?text=Kerala+Backwaters',
        is_available: true
      },
      {
        name: 'Goa Beaches',
        description: 'Relax on the pristine beaches of Goa with water sports and nightlife',
        state: 'Goa',
        price_per_night: 3500,
        max_guests: 4,
        amenities: ['Beach Access', 'WiFi', 'Restaurant', 'Bar'],
        image_url: 'https://via.placeholder.com/400x300?text=Goa+Beaches',
        is_available: true
      },
      {
        name: 'Rajasthan Desert Safari',
        description: 'Experience the magic of the Thar Desert with camel safaris and cultural shows',
        state: 'Rajasthan',
        price_per_night: 2500,
        max_guests: 2,
        amenities: ['Desert Camp', 'Meals', 'Camel Safari', 'Bonfire'],
        image_url: 'https://via.placeholder.com/400x300?text=Rajasthan+Desert',
        is_available: true
      },
      {
        name: 'Kashmir Valley',
        description: 'Explore the paradise on earth with snow-capped mountains and lush valleys',
        state: 'Jammu & Kashmir',
        price_per_night: 6000,
        max_guests: 4,
        amenities: ['Mountain View', 'Heating', 'Meals', 'Trek Guide'],
        image_url: 'https://via.placeholder.com/400x300?text=Kashmir+Valley',
        is_available: true
      },
      {
        name: 'Jaipur City Palace',
        description: 'Explore the magnificent City Palace and the Pink City of Jaipur',
        state: 'Rajasthan',
        price_per_night: 3000,
        max_guests: 3,
        amenities: ['WiFi', 'AC', 'Restaurant', 'City Tour'],
        image_url: 'https://via.placeholder.com/400x300?text=Jaipur+Palace',
        is_available: true
      },
      {
        name: 'Himachal Hillstations',
        description: 'Enjoy the beautiful hill stations of Himachal Pradesh with scenic views',
        state: 'Himachal Pradesh',
        price_per_night: 2800,
        max_guests: 4,
        amenities: ['Mountain View', 'Heater', 'WiFi', 'Adventure Sports'],
        image_url: 'https://via.placeholder.com/400x300?text=Himachal+Hills',
        is_available: true
      },
      {
        name: 'Mumbai City Tour',
        description: 'Discover the energy and culture of Mumbai, the city that never sleeps',
        state: 'Maharashtra',
        price_per_night: 4000,
        max_guests: 2,
        amenities: ['WiFi', 'AC', 'City View', 'Restaurant'],
        image_url: 'https://via.placeholder.com/400x300?text=Mumbai+City',
        is_available: true
      }
    ];

    const existingCount = dbType === 'mongodb'
      ? await Destination.countDocuments()
      : await Destination.count();

    if (existingCount > 0) {
      console.log('✓ Database already initialized with sample data');
    } else {
      if (dbType === 'mongodb') {
        await Destination.insertMany(destinations);
      } else {
        await Destination.bulkCreate(destinations);
      }
      console.log('✓ Sample destinations added successfully');
    }

    console.log('✓ Database initialization completed successfully');
    console.log('\n📊 Sample Data Added:');
    console.log('   - 8 Travel Destinations');
    console.log('   - Multiple price ranges (₹2,500 - ₹6,000 per night)');
    console.log('   - Various amenities and services');

    process.exit(0);
  } catch (error) {
    console.error('Database initialization error:', error.message);
    process.exit(1);
  }
};

initDatabase();
