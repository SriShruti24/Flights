'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Seat extends Model {
    static associate(models) {
      this.belongsTo(models.flight, {
        foreignKey: 'flightId',
        as: 'flightDetail',
        onDelete: 'CASCADE'
      });
    }
  }
  Seat.init({
    flightId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    seatNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    seatClass: {
      type: DataTypes.ENUM('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST_CLASS'),
      allowNull: false,
      defaultValue: 'ECONOMY'
    },
    seatType: {
      type: DataTypes.ENUM('WINDOW', 'AISLE', 'MIDDLE', 'EXTRA_LEG_ROOM'),
      allowNull: false,
      defaultValue: 'MIDDLE'
    },
    status: {
      type: DataTypes.ENUM('AVAILABLE', 'HOLD', 'BOOKED', 'BLOCKED', 'CHECKED_IN'),
      allowNull: false,
      defaultValue: 'AVAILABLE'
    },
    holdBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    holdUntil: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fareMultiplier: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 1.00
    }
  }, {
    sequelize,
    modelName: 'Seat',
  });
  return Seat;
};