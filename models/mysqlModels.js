// ==================== MYSQL/SEQUELIZE MODELS ====================

import { Sequelize, DataTypes } from 'sequelize';

export const createMySQLModels = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
    bio: DataTypes.TEXT,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, { tableName: 'users', timestamps: false });

  const Destination = sequelize.define('Destination', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price_per_night: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    max_guests: {
      type: DataTypes.INTEGER,
      defaultValue: 4
    },
    image_url: DataTypes.STRING,
    amenities: DataTypes.JSON,
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, { tableName: 'destinations', timestamps: false });

  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    destination_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    check_in_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    check_out_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    num_guests: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      defaultValue: 'pending'
    },
    special_requests: DataTypes.TEXT,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, { tableName: 'bookings', timestamps: false });

  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    booking_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'INR'
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    stripe_payment_id: DataTypes.STRING,
    transaction_id: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, { tableName: 'payments', timestamps: false });

  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    destination_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    comment: DataTypes.TEXT,
    photos: DataTypes.JSON,
    helpful_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, { tableName: 'reviews', timestamps: false });

  // Set up associations
  User.hasMany(Booking, { foreignKey: 'user_id' });
  Booking.belongsTo(User, { foreignKey: 'user_id' });

  Destination.hasMany(Booking, { foreignKey: 'destination_id' });
  Booking.belongsTo(Destination, { foreignKey: 'destination_id' });

  User.hasMany(Review, { foreignKey: 'user_id' });
  Review.belongsTo(User, { foreignKey: 'user_id' });

  Destination.hasMany(Review, { foreignKey: 'destination_id' });
  Review.belongsTo(Destination, { foreignKey: 'destination_id' });

  Booking.hasOne(Payment, { foreignKey: 'booking_id' });
  Payment.belongsTo(Booking, { foreignKey: 'booking_id' });

  return { User, Destination, Booking, Payment, Review };
};
